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

import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getLocale } from "next-intl/server";
import { Locale } from "@/i18n-config";

const app = new Hono().get(
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
