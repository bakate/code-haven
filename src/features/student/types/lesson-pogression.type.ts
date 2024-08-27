import { lessonProgression } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectLessonProgressionSchema =
  createSelectSchema(lessonProgression);

export type LessonProgression = z.infer<typeof selectLessonProgressionSchema>;
