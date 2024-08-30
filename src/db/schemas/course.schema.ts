import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { category } from "./category.schema";
import { attachment } from "./attachment.schema";
import { chapter } from "./chapter.schema";
import { courseProgression } from "./progression.schema";

const languageEnum = ["en-us", "fr", "es", "de", "it"] as const;

// Course Schemas
export const course = pgTable("course", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isPublished: boolean("is_published").default(false).notNull(),
  price: integer("price"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  categoryId: text("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// course enrollment
export const courseEnrollment = pgTable("course_enrollment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  enrolledAt: timestamp("enrolled_at", { mode: "date" }).defaultNow(),
});

export const courseEnrollmentRelations = relations(
  courseEnrollment,
  ({ one }) => ({
    course: one(course, {
      fields: [courseEnrollment.courseId],
      references: [course.id],
    }),
    user: one(users, {
      fields: [courseEnrollment.userId],
      references: [users.id],
    }),
  })
);

// Define relations for course
export const courseRelations = relations(course, ({ one, many }) => ({
  user: one(users, {
    fields: [course.userId],
    references: [users.id],
  }),
  category: one(category, {
    fields: [course.categoryId],
    references: [category.id],
  }),
  attachments: many(attachment),
  chapters: many(chapter),
  courseTranslations: many(courseTranslation),
  courseProgressions: many(courseProgression),
  students: many(courseEnrollment),
}));

// Define the course translation table
export const courseTranslation = pgTable("course_translation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade", onUpdate: "cascade" }),
  lang: text("lang", { enum: languageEnum }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

export const courseTranslationRelations = relations(
  courseTranslation,
  ({ one }) => ({
    course: one(course, {
      fields: [courseTranslation.courseId],
      references: [course.id],
    }),
  })
);
