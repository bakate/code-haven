"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button, Checkbox, CircularProgress } from "@nextui-org/react";
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
    isFree: boolean;
    chapterId: string;
  };
};

export const ChapterAccessSettingsForm = ({ initialData }: Props) => {
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
      // we receive a boolean whereas the form expects a string
      isFree: initialData.isFree,
      title: initialData.title,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CourseFormType) => {
    mutate({
      courseId: initialData.courseId,
      isFree: data.isFree ?? false,
    });
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md dark:bg-slate-900 dark:border-slate-700">
      <div className="font-medium flex items-center justify-between">
        {t("editAccess")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          startContent={!isEditing ? <FaPencil /> : null}
        >
          {isEditing ? t("cancel") : "Edit access"}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-small mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree ? <>{t("freePreview")}</> : <>{t("notFree")}</>}
        </p>
      ) : null}
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
            aria-label="Chapter Access Settings Form"
          >
            {isPending ? (
              <div className="flex justify-center items-center">
                <CircularProgress color="primary" aria-label="Loading" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="isFree"
                disabled={isPending}
                render={({ field }) => {
                  return (
                    <Checkbox
                      {...field}
                      aria-label="isFree"
                      isSelected={field.value}
                      onChange={field.onChange}
                    >
                      {t("checkBoxLabel")}
                    </Checkbox>
                  );
                }}
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
