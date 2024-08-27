import { db } from "@/db/drizzle";
import {
  chapter,
  chapterTranslation,
  lessonProgression,
  muxData,
} from "@/db/schema";
import { ENV } from "@/env";
import {
  insertChapterSchema,
  selectChapterSchema,
} from "@/features/teacher/types/chapter.type";
import {
  remainingLocales,
  translateText,
} from "@/features/teacher/utils/translation";
import { Locale } from "@/i18n-config";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

const app = new Hono()
  .post(
    "/",
    verifyAuth(),
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
      const userId = auth.session.user.id;
      const values = c.req.valid("json");
      if (!values.title || !values.courseId) {
        throw c.json({ error: "Missing required fields" } as const, 422);
      }
      // TODO check if the user is the course owner

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

      // retrieve the latest chapter to set the position
      const [latestChapter] = await db
        .select({
          id: chapter.id,
          position: chapter.position,
        })
        .from(chapter)
        .where(eq(chapter.courseId, values.courseId))
        .orderBy(desc(chapter.position))
        .limit(1);

      const newPosition = latestChapter ? latestChapter.position + 1 : 1;

      try {
        const [{ newChapterId }] = await db
          .insert(chapter)
          .values({
            courseId: values.courseId,
            position: newPosition,
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
  )
  .patch(
    "/reorder",
    verifyAuth(),
    zValidator(
      "json",
      z.array(
        z.object({
          id: z.string(),
          courseId: z.string(),
          position: z.number(),
        })
      )
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const values = c.req.valid("json");
      if (
        !values.length ||
        values.some(
          (v) =>
            !v.id ||
            !v.courseId ||
            v.position === undefined ||
            v.position === null
        )
      ) {
        throw c.json({ error: "Missing required fields" } as const, 422);
      }
      const translations = await getTranslations("createOrEditCourseForm");

      try {
        await Promise.all(
          values.map(async (value) => {
            await db
              .update(chapter)
              .set({
                position: value.position,
              })
              .where(
                and(
                  eq(chapter.id, value.id),
                  eq(chapter.courseId, value.courseId)
                )
              );
          })
        );
        return c.json({
          status: "success",
          message: translations("chaptersReorderedSuccessfully"),
          courseId: values[0].courseId,
        } as const);
      } catch (error) {
        return c.json({
          status: "error",
          message: translations("errorReorderingChapters"),
        } as const);
      }
    }
  )
  .patch(
    "/:id",
    verifyAuth(),
    zValidator(
      "param",
      selectChapterSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "json",
      selectChapterSchema
        .pick({
          title: true,
          description: true,
          isFree: true,
          isPublished: true,
          courseId: true,
          videoUrl: true,
          muxDataId: true,
        })
        .partial()
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      if (!id) {
        throw c.json({ error: "Missing required chapter ID" } as const, 422);
      }
      if (!values) {
        throw c.json({ error: "Missing required fields" } as const, 422);
      }
      if (!values?.courseId) {
        throw c.json({ error: "Missing required course ID" } as const, 422);
      }
      const [currentLocale, translations] = await Promise.all([
        getLocale(),
        getTranslations("createOrEditCourseForm"),
      ]);
      const usLocale = "en-us";

      const updateTranslations = async (field: "title" | "description") => {
        if (values[field]) {
          const [fieldTranslations] = (await translateText({
            from: currentLocale === usLocale ? "en" : currentLocale,
            texts: [values[field]],
            to: remainingLocales(currentLocale),
          })) ?? [{ translations: [] }];

          try {
            await db
              .update(chapterTranslation)
              .set({
                [field]: values[field],
              })
              .where(
                and(
                  eq(chapterTranslation.chapterId, id),
                  eq(chapterTranslation.lang, currentLocale as Locale)
                )
              );
            await Promise.all(
              fieldTranslations.translations.map(({ text, to }) => {
                return db
                  .update(chapterTranslation)
                  .set({
                    [field]: text,
                  })
                  .where(
                    and(
                      eq(chapterTranslation.chapterId, id),
                      eq(
                        chapterTranslation.lang,
                        to === "en" ? usLocale : (to as Locale)
                      )
                    )
                  );
              })
            );
          } catch (error) {
            return {
              status: "error",
              message: translations("error_message"),
            } as const;
          }
        }
      };

      if (values.title || values.description) {
        const updateResults = await Promise.all([
          updateTranslations("title"),
          updateTranslations("description"),
        ]);
        if (updateResults.some((result) => result?.status === "error")) {
          return c.json({
            status: "error",
            message: translations("error_message"),
          } as const);
        }
      }
      let newPlaybackId;
      if (values.videoUrl) {
        const muxResult = await handleMuxVideo({
          id,
          videoUrl: values.videoUrl,
          translations,
        });
        if (muxResult.status === "error") {
          return c.json(muxResult);
        }
        values.muxDataId = muxResult.muxDataId;
        newPlaybackId = muxResult.playbackId;
      }

      try {
        await db
          .update(chapter)
          .set({
            ...values,
            updatedAt: new Date(),
          })
          .where(
            and(eq(chapter.id, id), eq(chapter.courseId, values.courseId))
          );
        return c.json({
          status: values.videoUrl ? "processing" : "success",
          message: translations("courseUpdatedSuccessfully"),
          courseId: values.courseId,
          chapterId: id,
          playbackId: newPlaybackId,
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
    "/video-status",
    verifyAuth(),
    zValidator(
      "query",
      selectChapterSchema.pick({
        id: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { id: chapterId } = c.req.valid("query");

      if (!chapterId) {
        throw c.json({ error: "Missing required chapter ID" } as const, 422);
      }

      const [{ status = null } = {}] = await db
        .select({
          status: muxData.status,
        })
        .from(muxData)
        .where(eq(muxData.chapterId, chapterId));

      return c.json({ status } as const);
    }
  )
  .get(
    "/:id",
    verifyAuth(),
    zValidator(
      "param",
      selectChapterSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "query",
      selectChapterSchema.pick({
        courseId: true,
      })
    ),

    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const userId = auth.session.user.id;
      const { id: chapterId } = c.req.valid("param");
      const { courseId } = c.req.valid("query");

      if (!chapterId) {
        throw c.json({ error: "Missing required chapter ID" } as const, 422);
      }
      if (!courseId) {
        throw c.json({ error: "Missing required course ID" } as const, 422);
      }
      const [data] = await db
        .select({
          id: chapter.id,
          courseId: chapter.courseId,
          position: chapter.position,
          isPublished: chapter.isPublished,
          isFree: chapter.isFree,
          playbackId: muxData?.playbackId,
          videoStatus: muxData?.status,
          videoPlaybackPosition: lessonProgression.videoPlaybackPosition,
          isCompleted: lessonProgression.isCompleted,
          titlesAndDescriptions: sql<
            Array<{
              title: string;
              description?: string;
              lang: Locale;
            }>
          >`
          jsonb_agg(
            jsonb_build_object(
              'title', ${chapterTranslation.title},
              'description', ${chapterTranslation.description},
              'lang', ${chapterTranslation.lang}
            )
          )
          `,
        })
        .from(chapter)
        .leftJoin(
          chapterTranslation,
          eq(chapter.id, chapterTranslation.chapterId)
        )
        .leftJoin(muxData, eq(muxData.chapterId, chapterId))
        .leftJoin(
          lessonProgression,
          and(
            eq(lessonProgression.userId, userId),
            eq(lessonProgression.chapterId, chapterId)
          )
        )
        .where(and(eq(chapter.id, chapterId), eq(chapter.courseId, courseId)))
        .groupBy(
          chapter.id,
          muxData.playbackId,
          muxData.status,
          lessonProgression.videoPlaybackPosition,
          lessonProgression.isCompleted
        );

      if (!chapter) {
        throw c.json({ error: "Chapter not found" } as const, 404);
      }
      return c.json({
        status: "success",
        data,
      } as const);
    }
  )
  .delete(
    "/:id",
    verifyAuth(),
    zValidator(
      "param",
      selectChapterSchema.pick({
        id: true,
      })
    ),
    zValidator(
      "query",
      selectChapterSchema.pick({
        courseId: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      if (!auth.session?.user?.id) {
        throw c.json({ error: "Unauthorized" } as const, 401);
      }
      const { id: chapterId } = c.req.valid("param");
      const { courseId } = c.req.valid("query");
      if (!chapterId) {
        throw c.json({ error: "Missing required chapter ID" } as const, 422);
      }
      if (!courseId) {
        throw c.json({ error: "Missing required course ID" } as const, 422);
      }

      const translations = await getTranslations("createOrEditCourseForm");
      try {
        await db
          .delete(chapter)
          .where(
            and(eq(chapter.id, chapterId), eq(chapter.courseId, courseId))
          );
        return c.json({
          status: "success",
          message: translations("chapterDeletedSuccessfully"),
          courseId,
        } as const);
      } catch (error) {
        return c.json({
          status: "error",
          message: translations("chapterDeletedError"),
        } as const);
      }
    }
  );

export default app;

// helpers for the chapter API

const handleMuxVideo = async ({
  id,
  translations,
  videoUrl,
}: {
  id: string;
  videoUrl: string;
  translations: any;
}) => {
  const existingMuxData = await db.query.muxData.findFirst({
    where: eq(muxData.chapterId, id),
    columns: { assetId: true },
  });

  if (existingMuxData) {
    await db.delete(muxData).where(eq(muxData.chapterId, id));
    await fetch(
      `https://api.mux.com/video/v1/assets/${existingMuxData.assetId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${btoa(
            `${ENV.MUX_TOKEN_ID}:${ENV.MUX_TOKEN_SECRET}`
          )}`,
        },
      }
    );
  }
  const muxResponse = await fetch("https://api.mux.com/video/v1/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ENV.NEXT_PUBLIC_APP_URL,
      Authorization: `Basic ${btoa(
        `${ENV.MUX_TOKEN_ID}:${ENV.MUX_TOKEN_SECRET}`
      )}`,
    },
    body: JSON.stringify({
      input: [{ url: videoUrl }],
      playback_policy: ["public"],
      test: false,
    }),
  });

  if (!muxResponse.ok) {
    return { status: "error", message: translations("error_message") } as const;
  }

  const asset = await muxResponse.json();
  try {
    const [{ newMuxDataId = "", playbackId }] = await db
      .insert(muxData)
      .values({
        chapterId: id,
        assetId: asset.data.id,
        playbackId: asset.data.playback_ids?.[0].id,
      })
      .returning({ newMuxDataId: muxData.id, playbackId: muxData.playbackId });

    return { status: "processing", muxDataId: newMuxDataId, playbackId };
  } catch (error) {
    return { status: "error", message: translations("error_message") } as const;
  }
};
