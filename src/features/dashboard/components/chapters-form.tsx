"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FiPlus } from "react-icons/fi";
import { useCreateChapter } from "../data/use-create-chapter";
import { ChapterFormTitleType, ChapterTitleSchema } from "../types";

type Props = {
  initialData: {
    courseId: string;
    title: string;
  };
};

export const ChaptersForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useCreateChapter();
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");

  const form = useForm<ChapterFormTitleType>({
    resolver: zodResolver(
      ChapterTitleSchema({
        title: {
          max_error: t("max_error"),
          min_error: t("min_error"),
        },
      })
    ),
    defaultValues: {
      title: "nouveau chapitre",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: ChapterFormTitleType) => {
    mutate(
      {
        title: data.title,
        courseId: initialData.courseId,
      },
      {
        onSuccess: () => {
          form.reset();
          toggleCreating();
        },
      }
    );
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md">
      <div className="font-medium flex items-center justify-between">
        {t("createChapters")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleCreating}
          startContent={!isCreating ? <FiPlus /> : null}
        >
          {isCreating ? t("cancel") : t("editChapterTitle")}
        </Button>
      </div>
      {!isCreating ? (
        <p
          className={cn(
            "text-small mt-2",
            !initialData.title && "text-slate-500 italic"
          )}
        >
          {initialData.title ?? t("noChapters")}
        </p>
      ) : null}
      {isCreating ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={t("chapterLabel")}
                  placeholder={t("chapterTitlePlaceholder")}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <div className="flex items-center gap-x2">
              <Button type="submit" color="primary" disabled={isPending}>
                {t("submit_button")}
              </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </div>
  );
};
