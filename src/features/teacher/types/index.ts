import { IconType } from "react-icons/lib";
import { z } from "zod";
import { insertChapterSchema } from "./chapter.type";

export type CourseRoutes = {
  label: string;
  href: string;
  icon: IconType;
}[];

const minLength = 3;
const maxLength = 50;
type TitleErrorType = {
  min_error: string;
  max_error: string;
};
export type CreateCourseFormMessage = {
  title: TitleErrorType;
  price?: {
    min_error: string;
  };
};
export const CreateCourseFormSchema = (
  translations?: CreateCourseFormMessage
) => {
  return z.object({
    title: z
      .string()
      .min(
        minLength,
        translations
          ? {
              message: translations.title.min_error,
            }
          : undefined
      )
      .max(
        maxLength,
        translations
          ? {
              message: translations.title.max_error,
            }
          : undefined
      ),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    imageUrl: z.string().optional(),
    isFree: z.coerce.boolean().optional().default(true),
    // we receive a string from the form, we need to convert it and make sure it's positive number
    price: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (value) {
            const price = parseFloat(value);
            return price >= 0;
          }
          return true;
        },
        { message: translations?.price?.min_error }
      ),
  });
};

export type CourseFormType = z.infer<ReturnType<typeof CreateCourseFormSchema>>;

type ChapterFormTitleError = {
  title: TitleErrorType;
};
export const ChapterTitleSchema = (translations?: ChapterFormTitleError) => {
  return z.object({
    title: z
      .string()
      .min(
        minLength,
        translations
          ? {
              message: translations.title.min_error,
            }
          : undefined
      )
      .max(
        maxLength,
        translations
          ? {
              message: translations.title.max_error,
            }
          : undefined
      ),
  });
};

export type ChapterFormTitleType = z.infer<
  ReturnType<typeof ChapterTitleSchema>
>;

export type selectChapterType = z.infer<typeof insertChapterSchema>;

export type CourseType = {
  id: string;
  titles: { lang: string; title: string }[];
  price: number;
  isPublished: boolean;
  categoryId: string;
};

export type StateType = {
  filterValue: string;
  selectedKeys: Set<string>;
  statusFilter: string;
  visibleColumns: Set<string>;
  rowsPerPage: number;
  sortDescriptor: {
    column?: keyof CourseType;
    direction: "ascending" | "descending";
  };
  page: number;
};
