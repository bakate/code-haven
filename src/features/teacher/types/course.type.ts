import { course, courseTranslation } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Create insert schema for course
export const insertCourseTranslation = createInsertSchema(courseTranslation);
export const insertCourseSchema = createInsertSchema(course).merge(
  insertCourseTranslation.pick({
    lang: true,
    title: true,
    description: true,
  })
);

export const selectTranslatedCourseSchema =
  createSelectSchema(courseTranslation);
export const selectCourseSchema = createSelectSchema(course).merge(
  selectTranslatedCourseSchema
);
