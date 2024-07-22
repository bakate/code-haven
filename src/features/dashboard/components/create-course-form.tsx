"use client";

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useCreateTeacherCourse } from "../data/use-create-teacher-course";
import { CreateCourseFormSchema, CreateCourseFormType } from "../types";

export const CreateCourseForm = () => {
  const t = useTranslations("createCourseForm");
  const { mutate, isPending } = useCreateTeacherCourse();
  const form = useForm<CreateCourseFormType>({
    resolver: zodResolver(
      CreateCourseFormSchema({
        title: {
          max_error: t("max_error"),
          min_error: t("min_error"),
        },
      })
    ),
    defaultValues: {
      title: "coucou mon grand",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CreateCourseFormType) => {
    mutate(data);
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
