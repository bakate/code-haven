import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./schemas/user.schema";
import {
  course,
  courseTranslation,
  courseRelations,
  courseTranslationRelations,
} from "./schemas/course.schema";
import { category } from "./schemas/category.schema";
import { attachment, attachmentRelations } from "./schemas/attachment.schema";
import {
  chapter,
  chapterTranslation,
  chapterRelations,
  chapterTranslationRelations,
} from "./schemas/chapter.schema";
import { muxData } from "./schemas/mux.schema";

export {
  course,
  category,
  attachment,
  courseTranslation,
  courseRelations,
  courseTranslationRelations,
  chapter,
  chapterTranslation,
  chapterRelations,
  chapterTranslationRelations,
  attachmentRelations,
  muxData,
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
};
