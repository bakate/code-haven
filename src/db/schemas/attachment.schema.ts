import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { course } from "./course.schema";
import { chapter } from "./chapter.schema";

export const attachment = pgTable("attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").references(() => course.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  chapterId: text("chapter_id").references(() => chapter.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Add this relation definition
export const attachmentRelations = relations(attachment, ({ one }) => ({
  course: one(course, {
    fields: [attachment.courseId],
    references: [course.id],
  }),
  chapter: one(chapter, {
    fields: [attachment.chapterId],
    references: [chapter.id],
  }),
}));
