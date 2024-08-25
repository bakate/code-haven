import { relations } from "drizzle-orm";

import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { course } from "./course.schema";
import { chapter } from "./chapter.schema";

export const lessonProgression = pgTable("lesson_progression", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  chapterId: text("chapter_id")
    .notNull()
    .references(() => chapter.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  lastPosition: integer("last_position").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const courseProgression = pgTable("course_progression", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  completedChapters: integer("completed_chapters").notNull().default(0),
  totalChapters: integer("total_chapters").notNull(),
  lastCompletedChapterId: text("last_completed_chapter_id").references(
    () => chapter.id
  ),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const lessonProgressionRelations = relations(
  lessonProgression,
  ({ one }) => ({
    user: one(users, {
      fields: [lessonProgression.userId],
      references: [users.id],
    }),
    chapter: one(chapter, {
      fields: [lessonProgression.chapterId],
      references: [chapter.id],
    }),
  })
);

export const courseProgressionRelations = relations(
  courseProgression,
  ({ one }) => ({
    user: one(users, {
      fields: [courseProgression.userId],
      references: [users.id],
    }),
    course: one(course, {
      fields: [courseProgression.courseId],
      references: [course.id],
    }),
    lastCompletedChapter: one(chapter, {
      fields: [courseProgression.lastCompletedChapterId],
      references: [chapter.id],
    }),
  })
);
