"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { useMedia } from "react-use";
import { LuFilePlus, LuPencil } from "react-icons/lu";
import { ImCancelCircle } from "react-icons/im";
import { useCreateChapter } from "../data/use-create-chapter";
import { useReorderChapters } from "../data/use-reorder-chapters";
import {
  ChapterFormTitleType,
  ChapterTitleSchema,
  selectChapterType,
} from "../types";
import { ChaptersList } from "./chapters-list";
import { FormContainer } from "./form-container";

type Props = {
  initialData: {
    courseId: string;
    chapters: selectChapterType[];
  };
};

export const ChaptersForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useCreateChapter();
  const reorderMutation = useReorderChapters();
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");
  const isTablet = useMedia("(min-width: 640px)", false);
  const router = useRouter();

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
      title: "",
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

  const onEdit = (chapterId: string) => {
    router.push(
      `/teacher/courses/${initialData.courseId}/chapters/${chapterId}`
    );
  };

  const onReorder = (
    updateData: { id: string; position: number; courseId: string }[]
  ) => {
    reorderMutation.mutate(updateData);
  };
  return (
    <FormContainer>
      <div className="font-medium flex items-center justify-between">
        {t("createChapters")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleCreating}
          isIconOnly={!isTablet}
          startContent={!isCreating ? <FiPlus /> : <ImCancelCircle />}
        >
          {!isTablet ? "" : isCreating ? t("cancel") : t("addChapterTitle")}
        </Button>
      </div>

      {isCreating ? (
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
            )}
            <Button type="submit" color="primary" disabled={isPending}>
              {t("submit_button")}
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={cn(
              "text-sm my-2",
              !initialData.chapters.length ? "text-slate-500 italic" : ""
            )}
          >
            {!initialData.chapters.length ? (
              t("noChapters")
            ) : (
              <ChaptersList
                onEdit={onEdit}
                onReorder={onReorder}
                items={initialData.chapters}
              />
            )}
          </div>
          {!isCreating ? (
            <p className="text-small mt-4 text-foreground-400">
              {t("dragAndDropToReorder")}
            </p>
          ) : null}
        </>
      )}
    </FormContainer>
  );
};
