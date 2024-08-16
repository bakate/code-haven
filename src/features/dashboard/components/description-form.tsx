"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button, CircularProgress, Textarea } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencil } from "react-icons/fa6";
import { useEditCourseByTeacher } from "../data/use-edit-course-by-teacher";
import { CourseFormType, CreateCourseFormSchema } from "../types";
import { FormContainer } from "./form-container";

type Props = {
  initialData: {
    courseId: string;
    description?: string;
    title: string;
  };
};

export const DescriptionForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useEditCourseByTeacher(initialData.courseId);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");

  const form = useForm<CourseFormType>({
    resolver: zodResolver(
      CreateCourseFormSchema({
        title: {
          max_error: t("max_error"),
          min_error: t("min_error"),
        },
      })
    ),
    defaultValues: {
      description: initialData.description,
      title: initialData.title,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CourseFormType) => {
    mutate({
      description: data.description,
    });
  };
  return (
    <FormContainer>
      <div className="font-medium flex items-center justify-between">
        {t("courseDescription")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          startContent={!isEditing ? <FaPencil /> : null}
        >
          {isEditing ? t("cancel") : t("editDescription")}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-small mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {initialData.description ?? "No description"}
        </p>
      ) : null}
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {isPending ? (
              <div className="flex justify-center items-center">
                <CircularProgress color="primary" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    label={t("descriptionLabel")}
                    placeholder={t("descriptionPlaceholder")}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}

            <div className="flex items-center gap-x2">
              <Button type="submit" color="primary" disabled={isPending}>
                {t("saveChange")}
              </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </FormContainer>
  );
};
