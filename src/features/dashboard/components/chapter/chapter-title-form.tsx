"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencil } from "react-icons/fa6";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { CourseFormType, CreateCourseFormSchema } from "../../types";

type Props = {
  initialData: {
    courseId: string;
    title: string;
    chapterId: string;
  };
};

export const ChapterTitleForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useEditChapterById(initialData.chapterId);
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
      title: initialData.title,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CourseFormType) => {
    mutate({
      title: data.title,
      courseId: initialData.courseId,
    });
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md">
      <div className="font-medium flex items-center justify-between">
        {t("courseTitle")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          startContent={!isEditing ? <FaPencil /> : null}
        >
          {isEditing ? t("cancel") : t("editTitle")}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-small mt-2">{initialData.title}</p>
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
                name="title"
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label={t("titleLabel")}
                    placeholder={t("titlePlaceholder")}
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
    </div>
  );
};
