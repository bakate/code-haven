import { db } from "@/db/drizzle";
import { chapter, chapterTranslation, insertChapterSchema } from "@/db/schema";
import {
  remainingLocales,
  translateText,
} from "@/features/dashboard/utils/translation";
import { Locale } from "@/i18n-config";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getLocale, getTranslations } from "next-intl/server";

const app = new Hono().use("*", verifyAuth()).post(
  "/",
  zValidator(
    "json",
    insertChapterSchema.pick({
      courseId: true,
      title: true,
    })
  ),
  async (c) => {
    const auth = c.get("authUser");
    if (!auth.session?.user?.id) {
      throw c.json({ error: "Unauthorized" } as const, 401);
    }

    const values = c.req.valid("json");
    if (!values.title || !values.courseId) {
      throw c.json({ error: "Missing required fields" } as const, 422);
    }
    const usLocale = "en-us";
    const [currentLocale, translations] = await Promise.all([
      getLocale(),
      getTranslations("createOrEditCourseForm"),
    ]);
    const [titleTranslations] = (await translateText({
      from: currentLocale === usLocale ? "en" : currentLocale,
      texts: [values.title],
      to: remainingLocales(currentLocale),
    })) ?? [{ translations: [] }];

    try {
      const [{ newChapterId }] = await db
        .insert(chapter)
        .values({
          courseId: values.courseId,
          position: 0,
        })
        .returning({
          newChapterId: chapter.id,
        });

      await db.insert(chapterTranslation).values([
        {
          chapterId: newChapterId,
          lang: currentLocale as Locale,
          title: values.title,
        },
        ...titleTranslations.translations.map(({ text, to }) => ({
          chapterId: newChapterId,
          lang: to === "en" ? usLocale : (to as Locale),
          title: text,
        })),
      ]);
      return c.json({
        status: "success",
        message: translations("courseUpdatedSuccessfully"), // we send an update message since it's part of the course update process
        newChapterId,
        courseId: values.courseId,
      } as const);
    } catch (error) {
      return c.json({
        status: "error",
        message: translations("error_message"),
      } as const);
    }
  }
);

export default app;
