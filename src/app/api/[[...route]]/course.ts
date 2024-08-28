import { db } from "@/db/drizzle";
import {
  attachment,
  chapter,
  course,
  courseTranslation,
  lessonProgression,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { selectCourseSchema } from "@/features/teacher/types/course.type";

import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { z } from "zod";
import { selectLessonProgressionSchema } from "@/features/student/types/lesson-pogression.type";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      selectCourseSchema
        .pick({
          categoryId: true,
          title: true,
        })
        .optional()
    ),

    async (c) => {
      const values = c.req.valid("query");
      const { categoryId = "", title = "" } = values || {};

      const publishedCourses = await db
        .select({
          id: course.id,
          categoryId: course.categoryId,
          imageUrl: course.imageUrl,
          price: course.price,
          titles: sql<
            Array<{ lang: string; title: string; description?: string }>
          >`
json_agg(json_build_object('title', ${courseTranslation.title}, 'lang', ${courseTranslation.lang}, 'description', ${courseTranslation.description})) FILTER (WHERE ${courseTranslation.title} IS NOT NULL)
`,
          totalChapters: sql<number>`
        (
          SELECT COUNT(DISTINCT ${chapter.id})
          FROM ${chapter}
          WHERE ${chapter.courseId} = ${course.id} AND ${chapter.isPublished} = true
        )
      `,
        })
        .from(course)
        .where(
          and(
            eq(course.isPublished, true),
            categoryId ? eq(course.categoryId, categoryId) : undefined,
            title ? ilike(courseTranslation.title, `%${title}%`) : undefined
          )
        )
        .innerJoin(courseTranslation, eq(course.id, courseTranslation.courseId))
        .leftJoin(attachment, eq(course.id, attachment.courseId))
        .orderBy(desc(course.createdAt))
        .groupBy(course.id, course.categoryId, course.imageUrl, course.price);

      return c.json({
        data: publishedCourses,
      });
    }
  )
  .get(
    "/:id",
    verifyAuth(),
    zValidator(
      "param",
      selectCourseSchema.pick({
        id: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }

      const { id: courseId } = c.req.valid("param");

      const courseData = await db.query.course.findFirst({
        where: and(eq(course.id, courseId), eq(course.isPublished, true)),
        columns: {
          id: true,
          categoryId: true,
          imageUrl: true,
          price: true,
        },
        with: {
          courseTranslations: {
            columns: {
              title: true,
              lang: true,
              description: true,
            },
          },
          attachments: {
            columns: {
              id: true,
              url: true,
            },
          },
          chapters: {
            where: eq(chapter.isPublished, true),
            columns: {
              id: true,
              isFree: true,
              position: true,
            },
            orderBy: [asc(chapter.position)],
            with: {
              chapterTranslations: {
                columns: {
                  title: true,
                  lang: true,
                  description: true,
                },
              },
              muxData: {
                columns: {
                  duration: true,
                },
              },
              lessonProgressions: {
                where: eq(lessonProgression.userId, auth.session.user.id),
                columns: {
                  videoPlaybackPosition: true,
                  isCompleted: true,
                  chapterId: true,
                },
              },
            },
          },
        },
      });
      if (!courseData) {
        throw c.json({ error: "Course not found" } as const, 404);
      }

      return c.json({
        data: courseData,
      });
    }
  )
  .post(
    "/:id/progression",
    verifyAuth(),
    zValidator(
      "param",
      selectCourseSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "query",
      z.object({
        chapterId: z.string(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }

      const { id: courseId } = c.req.valid("param");
      const { chapterId } = c.req.valid("query");

      const courseData = await db.query.course.findFirst({
        where: eq(course.id, courseId),
        with: {
          chapters: true,
        },
      });

      if (!course || !courseData) {
        throw c.json({ error: "Course not found" } as const, 404);
      }

      // insert the lesson progression
      await db
        .insert(lessonProgression)
        .values({
          userId: auth.session.user.id,
          chapterId,
        })
        .onConflictDoNothing();

      return c.json({
        data: "course progression created",
      });
    }
  )
  .patch(
    "/:id/progression",
    verifyAuth(),
    zValidator(
      "param",
      selectCourseSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "json",
      selectLessonProgressionSchema
        .pick({
          videoPlaybackPosition: true,
          isCompleted: true,
          chapterId: true,
        })
        .partial()
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const userId = auth.session.user.id;
      const { id } = c.req.valid("param");
      const { chapterId, isCompleted, videoPlaybackPosition } =
        c.req.valid("json");
      if (!chapterId) {
        throw c.json(
          { error: "Missing required fields: chapterId" } as const,
          422
        );
      }

      await db
        .update(lessonProgression)
        .set({
          ...(isCompleted && { isCompleted: isCompleted }),
          ...(videoPlaybackPosition && {
            videoPlaybackPosition: videoPlaybackPosition,
          }),
        })
        .where(
          and(
            eq(lessonProgression.userId, userId),
            eq(lessonProgression.chapterId, chapterId)
          )
        );

      return c.json({
        chapterId,
        status: "success",
      });
    }
  );

export default app;
