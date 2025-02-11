"use client";

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Link } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useCreateCourseByTeacher } from "../data/use-create-course-by-teacher";
import { CourseFormType, CreateCourseFormSchema } from "../types";

export const CreateCourseForm = () => {
  const t = useTranslations("createOrEditCourseForm");
  const { mutate, isPending } = useCreateCourseByTeacher();
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
      title: "apprendre JavaScript",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CourseFormType) => {
    mutate({
      title: data.title,
    });
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">{t("title")}</h1>
        <p className="text-sm text-slate-600">{t("titleDescription")}</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
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
            <div className="flex items-center gap-x-2 justify-end">
              <Button
                as={Link}
                type="button"
                href="/"
                variant="ghost"
                disabled={isPending}
              >
                {t("cancel_button")}
              </Button>

              <Button type="submit" color="primary" disabled={isPending}>
                {t("submit_button")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
