import { IconType } from "react-icons/lib";
import { z } from "zod";

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
  });
};

export type CourseTitleFormType = z.infer<
  ReturnType<typeof CreateCourseFormSchema>
>;
