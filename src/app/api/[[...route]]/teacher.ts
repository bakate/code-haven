import { db } from "@/db/drizzle";
import {
  attachment,
  chapter,
  chapterTranslation,
  course,
  courseTranslation,
} from "@/db/schema";
import {
  insertCourseTranslation,
  selectCourseSchema,
} from "@/features/teacher/types/course.type";
import {
  remainingLocales,
  translateText,
} from "@/features/teacher/utils/translation";
import { Locale } from "@/i18n/request";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

const app = new Hono()
  .use("*", verifyAuth()) // Verify auth middleware for all routes
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const courses = await db
      .select({
        id: course.id,
        isPublished: course.isPublished,
        userId: course.userId,
        attachments: sql<
          Array<{ id: string; url: string; name: string }>
        >` jsonb_agg(jsonb_build_object('id', ${attachment.id}, 'url', ${attachment.url}, 'name', ${attachment.name})) FILTER (WHERE ${attachment.id} IS NOT NULL)`,
        titles: sql<
          Array<{ lang: string; title: string; description?: string }>
        >`
      json_agg(json_build_object('title', ${courseTranslation.title}, 'lang', ${courseTranslation.lang}, 'description', ${courseTranslation.description})) FILTER (WHERE ${courseTranslation.title} IS NOT NULL)
      `,
        categoryId: course.categoryId,
        imageUrl: course.imageUrl,
        price: course.price,
      })
      .from(course)
      .innerJoin(courseTranslation, eq(course.id, courseTranslation.courseId))
      .leftJoin(attachment, eq(course.id, attachment.courseId))
      .where(and(eq(course.userId, auth.session.user.id)))

      .orderBy(desc(course.createdAt))
      .groupBy(course.id);
    return c.json({
      data: courses,
    });
  })
  .post(
    "/",
    zValidator(
      "json",
      insertCourseTranslation.pick({
        title: true,
      })
    ),

    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const [currentLocale, translations] = await Promise.all([
        getLocale(),
        getTranslations("createOrEditCourseForm"),
      ]);
      const { title } = c.req.valid("json");

      if (!title) {
        return c.json({
          status: "error",
          message: translations("min_error"),
        } as const);
      }

      const usLocale = "en-us";
      const [titleTranslation] = (await translateText({
        from: currentLocale === usLocale ? "en" : currentLocale,
        texts: [title],
        to: remainingLocales(currentLocale),
      })) ?? [{ translations: [] }];

      const userId = auth.session.user.id;
      try {
        const [{ newCourseId }] = await db
          .insert(course)
          .values({
            userId,
          })
          .returning({
            newCourseId: course.id,
          });

        await db.insert(courseTranslation).values([
          {
            courseId: newCourseId,
            lang: currentLocale as Locale,
            title,
          },
          ...titleTranslation.translations.map(({ text, to }) => ({
            courseId: newCourseId,
            lang: to as Locale,
            title: text,
          })),
        ]);
        return c.json({
          status: "success",
          message: translations("success_message"),
          newCourseId,
        } as const);
      } catch (error) {
        return c.json({
          status: "error",
          message: translations("error_message"),
        } as const);
      }
    }
  )
  .get(
    "/:courseId",
    zValidator(
      "param",
      z.object({
        courseId: z.string().uuid(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { courseId } = c.req.valid("param");

      if (!courseId) {
        throw c.json({ error: "Course ID is required" } as const, 422);
      }

      const [courseData] = await db
        .select({
          id: course.id,
          isPublished: course.isPublished,
          userId: course.userId,
          categoryId: course.categoryId,
          price: course.price,
          imageUrl: course.imageUrl,
          titles: sql<
            Array<{ lang: string; title: string; description?: string }>
          >`
          json_agg(json_build_object('title', ${courseTranslation.title}, 'lang', ${courseTranslation.lang}, 'description', ${courseTranslation.description})) FILTER (WHERE ${courseTranslation.title} IS NOT NULL)
          `,
          attachments: sql<
            Array<{ id: string; url: string; name: string }>
          >` jsonb_agg(DISTINCT jsonb_build_object('id', ${attachment.id}, 'url', ${attachment.url}, 'name', ${attachment.name})) FILTER (WHERE ${attachment.id} IS NOT NULL)`,
          chapters: sql<
            Array<{
              id: string;
              title: string;
              lang: Locale;
              position: number;
              isFree: boolean;
              isPublished: boolean;
              description?: string;
              courseId: string;
            }>
          >`
       COALESCE(
        (SELECT json_agg(ch ORDER BY ch->>'position')
         FROM (
           SELECT jsonb_build_object(
             'id', ${chapter.id},
             'title', ${chapterTranslation.title},
             'position', ${chapter.position},
             'isFree', ${chapter.isFree},
             'isPublished', ${chapter.isPublished},
             'courseId', ${chapter.courseId},
             'description', ${chapterTranslation.description},
             'lang', ${chapterTranslation.lang}
           ) AS ch
           FROM ${chapter}
           LEFT JOIN ${chapterTranslation} ON ${eq(
            chapter.id,
            chapterTranslation.chapterId
          )}
           WHERE ${eq(chapter.courseId, course.id)}
         ) subq
        ), '[]'::json
      )`,
        })

        .from(course)
        .innerJoin(courseTranslation, eq(course.id, courseTranslation.courseId))
        .leftJoin(attachment, eq(course.id, attachment.courseId))
        .where(
          and(eq(course.id, courseId), eq(course.userId, auth.session.user.id))
        )
        .groupBy(course.id);
      return c.json({
        data: courseData
          ? {
              ...courseData,
            }
          : null,
      });
    }
  )
  .patch(
    "/:courseId",
    zValidator(
      "param",
      z.object({
        courseId: z.string().uuid(),
      })
    ),
    zValidator(
      "json",
      selectCourseSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        })
        .partial()
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { courseId } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!courseId) {
        throw c.json({ error: "Course ID is required" } as const, 422);
      }
      if (!values) {
        throw c.json({ error: "Title is required" } as const, 422);
      }
      const locale = await getLocale();

      const [currentLocale, translations] = await Promise.all([
        getLocale(),
        getTranslations("createOrEditCourseForm"),
      ]);

      if (values.title && !values.description) {
        const [titleTranslation] = (await translateText({
          from: currentLocale,
          texts: [values.title],
          to: remainingLocales(currentLocale),
        })) ?? [{ translations: [] }];
        try {
          await db
            .update(courseTranslation)
            .set({
              title: values.title,
            })
            .where(
              and(
                eq(courseTranslation.courseId, courseId),
                eq(courseTranslation.lang, locale as Locale)
              )
            );
          await Promise.all(
            titleTranslation.translations.map(({ text, to }) =>
              db
                .update(courseTranslation)
                .set({
                  title: text,
                })
                .where(
                  and(
                    eq(courseTranslation.courseId, courseId),
                    eq(courseTranslation.lang, to as Locale)
                  )
                )
            )
          );
        } catch (error) {
          return c.json({
            status: "error",
            message: translations("errorCourseUpdate"),
          } as const);
        }
      }
      if (values.description) {
        const [descriptionTranslation] = (await translateText({
          from: currentLocale,
          texts: [values.description],
          to: remainingLocales(currentLocale),
        })) ?? [{ translations: [] }];
        try {
          await db
            .update(courseTranslation)
            .set({
              description: values.description,
            })
            .where(
              and(
                eq(courseTranslation.courseId, courseId),
                eq(courseTranslation.lang, locale as Locale)
              )
            );
          await Promise.all(
            descriptionTranslation.translations.map(({ text, to }) =>
              db
                .update(courseTranslation)
                .set({
                  description: text,
                })
                .where(
                  and(
                    eq(courseTranslation.courseId, courseId),
                    eq(courseTranslation.lang, to as Locale)
                  )
                )
                .catch((error) => {
                  console.error(error);
                })
            )
          );
        } catch (error) {
          return c.json({
            status: "error",
            message: translations("errorCourseUpdate"),
          } as const);
        }
      }

      try {
        await db
          .update(course)
          .set({
            ...values,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(course.id, courseId),
              eq(course.userId, auth.session.user.id)
            )
          );
      } catch (error) {
        return c.json({
          status: "error",
          message: translations("errorCourseUpdate"),
        } as const);
      }

      return c.json({
        status: "success",
        message: translations("courseUpdatedSuccessfully"),
      } as const);
    }
  )
  .delete(
    "/:courseId",
    zValidator(
      "param",
      z.object({
        courseId: z.string().uuid(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { courseId } = c.req.valid("param");
      const translations = await getTranslations("teacherCourseById");

      try {
        await db
          .delete(course)
          .where(
            and(
              eq(course.id, courseId),
              eq(course.userId, auth.session.user.id)
            )
          );
      } catch (error) {
        return c.json({
          status: "error",
          message: translations("courseDeletedError"),
        } as const);
      }
      return c.json({
        status: "success",
        message: translations("courseDeletedSuccessfully"),
      } as const);
    }
  );

export default app;
