import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { chapter } from "./chapter.schema";
import { float } from "drizzle-orm/mysql-core";

export const lessonProgression = pgTable(
  "lesson_progression",
  {
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
    lastPosition: doublePrecision("last_position").notNull().default(0),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  },
  (table) => ({
    userChapterUnique: uniqueIndex("user_chapter_unique_idx").on(
      table.userId,
      table.chapterId
    ),
  })
);

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
