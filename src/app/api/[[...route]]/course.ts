import { db } from "@/db/drizzle";
import { attachment, chapter, course, courseTranslation } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { selectCourseSchema } from "@/features/teacher/types/course.type";

import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";

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
  );

export default app;
