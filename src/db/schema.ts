import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
  userRelations,
} from "./schemas/user.schema";
import {
  course,
  courseTranslation,
  courseRelations,
  courseTranslationRelations,
  courseEnrollment,
  courseEnrollmentRelations,
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
import {
  lessonProgression,
  lessonProgressionRelations,
  courseProgression,
  courseProgressionRelations,
} from "./schemas/progression.schema";

export {
  course,
  category,
  attachment,
  courseTranslation,
  courseRelations,
  courseTranslationRelations,
  courseEnrollment,
  courseEnrollmentRelations,
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
  lessonProgression,
  lessonProgressionRelations,
  courseProgression,
  courseProgressionRelations,
  userRelations,
};
