import { chapter, chapterTranslation } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertChapterTranslation = createInsertSchema(chapterTranslation);
export const selectTranslatedChapterSchema =
  createSelectSchema(chapterTranslation);
export const insertChapterSchema = createInsertSchema(chapter).merge(
  insertChapterTranslation.pick({
    lang: true,
    title: true,
    description: true,
  })
);
export const selectChapterSchema = createSelectSchema(chapter).merge(
  selectTranslatedChapterSchema.pick({
    title: true,
    description: true,
  })
);
