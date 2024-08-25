import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { course } from "./course.schema";
import { muxData } from "./mux.schema";
import { lessonProgression } from "./progression.schema";

const languageEnum = ["en-us", "fr", "es", "de", "it"] as const;

export const chapter = pgTable("chapter", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade", onUpdate: "cascade" }),
  isPublished: boolean("is_published").default(false).notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  position: integer("position").notNull(),
  muxDataId: text("mux_data_id"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
  chapterTranslations: many(chapterTranslation),
  muxData: one(muxData, {
    fields: [chapter.muxDataId],
    references: [muxData.id],
  }),
  lessonProgressions: many(lessonProgression),
}));

export const chapterTranslation = pgTable("chapter_translation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chapterId: text("chapter_id")
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade", onUpdate: "cascade" }),
  lang: text("lang", { enum: languageEnum }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

export const chapterTranslationRelations = relations(
  chapterTranslation,
  ({ one }) => ({
    chapter: one(chapter, {
      fields: [chapterTranslation.chapterId],
      references: [chapter.id],
    }),
  })
);
