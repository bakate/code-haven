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
  if (!translations) {
    return z.object({
      title: z.string().min(minLength).max(maxLength),
    });
  } else {
    return z.object({
      title: z
        .string()
        .min(minLength, {
          message: translations.title.min_error,
        })
        .max(maxLength, {
          message: translations.title.max_error,
        }),
    });
  }
};

export type CreateCourseFormType = z.infer<
  ReturnType<typeof CreateCourseFormSchema>
>;
