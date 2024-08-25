import { db } from "@/db/drizzle";
import {
  attachment,
  chapter,
  chapterTranslation,
  course,
  courseTranslation,
  muxData,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { selectCourseSchema } from "@/features/teacher/types/course.type";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getLocale } from "next-intl/server";
import { Locale } from "@/i18n-config";

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
    zValidator(
      "param",
      selectCourseSchema.pick({
        id: true,
      })
    ),
    async (c) => {
      const { id: courseId } = c.req.valid("param");
      const locale = (await getLocale()) as Locale;
      const [courseData] = await db
        .select({
          id: course.id,
          categoryId: course.categoryId,
          imageUrl: course.imageUrl,
          price: course.price,
          title: courseTranslation.title ?? "",
          description: courseTranslation.description ?? "",
          totalChapters: sql<number>`cast(count(${chapter.id}) as int)`,

          chapters: sql<
            Array<{
              id: string;
              title: string;
              description: string;
              isFree: boolean;
              playbackId: string;
            }>
          >`
          jsonb_agg(jsonb_build_object('id', ${chapter.id}, 'isFree', ${chapter.isFree}, 'playbackId', ${muxData.playbackId}))
          FILTER (WHERE (${chapter.position} = 1) AND (${chapter.isPublished} = true) AND (${chapter.isFree} = true))
          `.as("chapters"),
          courseTranslation: sql<{
            lang: string;
            title: string;
            description: string;
          }>`
          (SELECT jsonb_build_object(
            'lang', ${courseTranslation.lang},
            'title', ${courseTranslation.title},
            'description', ${courseTranslation.description}
          )
          FROM ${courseTranslation}
          WHERE ${course.id} = ${courseTranslation.courseId}

          LIMIT 1)
          `.as("courseTranslation"),
          chapterTranslations: sql<
            Array<{
              lang: string;
              title: string;
              description: string;
            }>
          >`
          jsonb_agg(jsonb_build_object('lang', ${chapterTranslation.lang}, 'title', ${chapterTranslation.title}, 'description', ${chapterTranslation.description}))
          FILTER (WHERE (${chapter.id} = ${chapterTranslation.chapterId}))
          `.as("chapterTranslations"),
        })
        .from(course)
        .where(eq(course.id, courseId))
        .innerJoin(
          courseTranslation,
          and(
            eq(course.id, courseTranslation.courseId),
            eq(courseTranslation.lang, locale)
          )
        )
        .leftJoin(attachment, eq(course.id, attachment.courseId))
        .innerJoin(
          chapter,
          and(eq(course.id, chapter.courseId), eq(chapter.isPublished, true))
        )
        .innerJoin(
          chapterTranslation,
          and(
            eq(chapter.id, chapterTranslation.chapterId),
            eq(chapterTranslation.lang, locale)
          )
        )
        .innerJoin(muxData, eq(chapter.muxDataId, muxData.id))

        .groupBy(
          courseTranslation.title,
          courseTranslation.description,
          course.id
        );

      if (!courseData) {
        return c.json(
          {
            message: "Course not found",
          },
          404
        );
      }

      return c.json({
        data: courseData,
      });
    }
  );

export default app;
