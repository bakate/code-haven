"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencil } from "react-icons/fa6";

import { useEditCourseByTeacher } from "../data/use-edit-course-by-teacher";
import { CourseFormType, CreateCourseFormSchema } from "../types";

type Props = {
  initialData: {
    courseId: string;
    categoryId: string | null;
    title: string;
  };
  options?: { label: string; value: string }[];
};

export const CategoryForm = ({ initialData, options }: Props) => {
  const { mutate, isPending } = useEditCourseByTeacher(initialData.courseId);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");

  const selectedOption = options?.find(
    (option) => option.value === initialData.categoryId
  );

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
      categoryId: initialData.categoryId ?? "",
      title: initialData.title,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CourseFormType) => {
    mutate(
      { categoryId: data.categoryId },
      {
        onSuccess: () => {
          toggleEditing();
        },
      }
    );
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md dark:bg-slate-900 dark:border-slate-700">
      <div className="font-medium flex items-center justify-between">
        {t("courseCategory")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          startContent={!isEditing ? <FaPencil /> : null}
        >
          {isEditing ? t("cancel") : t("editCategory")}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-small mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label ?? t("noCategory")}
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
                name="categoryId"
                render={({ field }) => {
                  return (
                    <Autocomplete
                      defaultItems={options ?? []}
                      label={t("category")}
                      placeholder={t("searchCategory")}
                      className="max-w-xs"
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                    >
                      {(option) => (
                        <AutocompleteItem key={option.value}>
                          {option.label}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
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
