import { db } from "@/db/drizzle";
import {
  attachment,
  chapter,
  course,
  courseEnrollment,
  courseProgression,
  courseTranslation,
  lessonProgression,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { verifyAuth, getAuthUser } from "@hono/auth-js";
import { z } from "zod";
import { selectLessonProgressionSchema } from "@/features/student/types/lesson-pogression.type";
import { selectCourseSchema } from "@/features/teacher/types/course.type";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        categories: z.string().optional(),
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const session = await getAuthUser(c);
      const userId = session?.user?.id;

      const values = c.req.valid("query");
      const { categories = "", title = "" } = values || {};
      const categoryIds = categories ? categories.split(",") : [];

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
          ...(userId
            ? {
                userProgress: sql<number | null>`
            (
              SELECT ${courseProgression.progressPercentage}
              FROM ${courseProgression}
              WHERE ${courseProgression.userId} = ${userId} AND ${courseProgression.courseId} = ${course.id}
            )
          `,
              }
            : {}),
        })
        .from(course)
        .where(
          and(
            eq(course.isPublished, true),
            categoryIds.length > 0
              ? inArray(course.categoryId, categoryIds)
              : undefined,
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
  .get("/enrolled", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    if (!auth.session?.user?.id) {
      throw c.json({ error: "Unauthorized" } as const, 401);
    }

    const userId = auth.session.user.id;
    // we need to get the courses that the user is enrolled in

    const enrolledCourses = await db
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

        userProgress: sql<{
          progressPercentage: number | null;
          completedChapters: number | null;
          totalChapters: number | null;
          isCompleted: boolean | null;
        }>`
    (
      SELECT json_build_object(
        'progressPercentage', ${courseProgression.progressPercentage},
        'completedChapters', ${courseProgression.completedChapters},
        'totalChapters', ${courseProgression.totalChapters},
        'isCompleted', ${courseProgression.isCompleted}
      )
      FROM ${courseProgression}
      WHERE ${courseProgression.userId} = ${userId} AND ${courseProgression.courseId} = ${course.id}
    )
  `,
      })
      .from(courseEnrollment)
      .where(eq(courseEnrollment.userId, userId))
      .innerJoin(course, eq(courseEnrollment.courseId, course.id))
      .leftJoin(
        courseTranslation,
        eq(courseEnrollment.courseId, courseTranslation.courseId)
      )
      .leftJoin(attachment, eq(courseEnrollment.courseId, attachment.courseId))
      .orderBy(desc(courseEnrollment.enrolledAt))
      .groupBy(
        course.id,
        courseEnrollment.courseId,
        courseEnrollment.enrolledAt
      );
    return c.json({
      data: enrolledCourses,
    });
  })
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
          courseProgressions: {
            where: and(
              eq(courseProgression.userId, auth.session.user.id),
              eq(courseProgression.courseId, courseId)
            ),
            columns: {
              progressPercentage: true,
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
      const userId = auth.session.user.id;

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

      // insert the course progression
      await db
        .insert(courseProgression)
        .values({
          userId,
          courseId,
        })
        .onConflictDoNothing();
      // insert the lesson progression
      await db
        .insert(lessonProgression)
        .values({
          userId,
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
      const { id: courseId } = c.req.valid("param");
      const { chapterId, isCompleted, videoPlaybackPosition } =
        c.req.valid("json");
      if (!chapterId) {
        throw c.json(
          { error: "Missing required fields: chapterId" } as const,
          422
        );
      }

      // since there is no enrollment, we'll consider the user as enrolled when the user start watching the course
      await db
        .insert(courseEnrollment)
        .values({
          userId,
          courseId,
        })
        .onConflictDoNothing();

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

      // update the course progression
      // get all the lessons of the course
      const courseChapters = await db.query.chapter.findMany({
        where: and(
          eq(chapter.courseId, courseId),
          eq(chapter.isPublished, true)
        ),
        with: {
          lessonProgressions: {
            where: eq(lessonProgression.userId, userId),
          },
        },
      });

      // Calculate the progression percentage
      const totalChapters = courseChapters.length;
      const completedChapters = courseChapters.filter((chapter) =>
        chapter.lessonProgressions.some(
          (progression) => progression.isCompleted
        )
      ).length;
      const progressPercentage = (completedChapters / totalChapters) * 100;

      await db
        .update(courseProgression)
        .set({
          progressPercentage,
          completedChapters,
          totalChapters,
          isCompleted: progressPercentage === 100,
        })
        .where(
          and(
            eq(courseProgression.userId, userId),
            eq(courseProgression.courseId, courseId)
          )
        );

      return c.json({
        chapterId,
        progressPercentage,
        completedChapters,
        totalChapters,
        courseId,
        status: "success",
      });
    }
  );

export default app;
