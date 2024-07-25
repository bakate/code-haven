import { db } from "@/db/drizzle";
import {
  course,
  courseTranslation,
  insertCourseTranslation,
} from "@/db/schema";
import {
  remainingLocales,
  translateText,
} from "@/features/dashboard/utils/translation";
import { Locale } from "@/i18n-config";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    const locale = await getLocale();
    const auth = c.get("authUser");

    if (!auth.session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const courses = await db
      .select({
        id: course.id,
        isPublished: course.isPublished,
        userId: course.userId,
        categoryId: course.categoryId,
        title: courseTranslation.title,
      })
      .from(course)
      .innerJoin(courseTranslation, eq(course.id, courseTranslation.courseId))
      .where(
        and(
          eq(courseTranslation.lang, locale as Locale),
          eq(course.userId, auth.session.user.id)
        )
      )

      .orderBy(desc(course.createdAt));
    return c.json({
      data: courses,
    });
  })
  .post(
    "/",
    verifyAuth(),
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
            lang: to === "en" ? usLocale : (to as Locale),
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
    verifyAuth(),
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
          titles: sql<
            Array<{ lang: string; title: string; description?: string }>
          >`
          json_agg(json_build_object('title', ${courseTranslation.title}, 'lang', ${courseTranslation.lang}, 'description', ${courseTranslation.description}))
          `,
        })
        .from(course)
        .innerJoin(courseTranslation, eq(course.id, courseTranslation.courseId))
        .where(
          and(
            // eq(courseTranslation.lang, locale as Locale),
            eq(course.id, courseId),
            eq(course.userId, auth.session.user.id)
          )
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
    verifyAuth(),
    zValidator(
      "param",
      z.object({
        courseId: z.string().uuid(),
      })
    ),
    zValidator(
      "json",
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { courseId } = c.req.valid("param");
      const { title, description } = c.req.valid("json");
      if (!courseId) {
        throw c.json({ error: "Course ID is required" } as const, 422);
      }
      if (!title && !description) {
        throw c.json({ error: "Title is required" } as const, 422);
      }
      const locale = await getLocale();

      const [currentLocale, translations] = await Promise.all([
        getLocale(),
        getTranslations("createOrEditCourseForm"),
      ]);
      const usLocale = "en-us";

      if (title) {
        const [titleTranslation] = (await translateText({
          from: currentLocale === usLocale ? "en" : currentLocale,
          texts: [title],
          to: remainingLocales(currentLocale),
        })) ?? [{ translations: [] }];
        try {
          await db
            .update(courseTranslation)
            .set({
              title,
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
                    eq(
                      courseTranslation.lang,
                      to === "en" ? usLocale : (to as Locale)
                    )
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
      if (description) {
        const [descriptionTranslation] = (await translateText({
          from: currentLocale === usLocale ? "en" : currentLocale,
          texts: [description],
          to: remainingLocales(currentLocale),
        })) ?? [{ translations: [] }];
        try {
          await db
            .update(courseTranslation)
            .set({
              description,
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
                    eq(
                      courseTranslation.lang,
                      to === "en" ? usLocale : (to as Locale)
                    )
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

      return c.json({
        status: "success",
        message: translations("courseUpdatedSuccessfully"),
      } as const);
    }
  );

export default app;
