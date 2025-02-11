"use client";

import { NovelEditor } from "@/components/novel-editor/advanced-editor";
import { Button, CircularProgress } from "@heroui/react";
import { useTranslations } from "next-intl";
import { EditorInstance } from "novel";
import { useState } from "react";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { FormContainer } from "../form-container";
import { ToggleButton } from "../toggle-button";
import { LuBookDown } from "react-icons/lu";
import { IconBadge } from "@/components/icon-badge";
import { Heading } from "@/components/heading";

type Props = {
  initialData: {
    courseId: string;
    content: string | null;
    chapterId: string;
    title: string | null;
  };
};

export const ChapterContentForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useEditChapterById(initialData.chapterId);
  const [isEditing, setIsEditing] = useState(false);
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editor) return;
    const content = editor.getJSON();
    mutate({
      content: JSON.stringify(content),
      courseId: initialData.courseId,
    });
  };
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LuBookDown} />
        <Heading>{t("contentLabel")}</Heading>
      </div>
      <FormContainer>
        <div className="font-medium flex items-center justify-between">
          {t("contentLabel")}

          <ToggleButton
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            isPending={isPending}
            editingContent={t("cancel")}
            readonlyContent={t("editContent")}
          />
        </div>
        {!isEditing ? (
          <NovelEditor
            content={initialData.content}
            setEditor={setEditor}
            teacherView={false}
          />
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            {isPending ? (
              <div className="flex justify-center items-center">
                <CircularProgress color="primary" aria-label="Saving" />
              </div>
            ) : (
              <NovelEditor
                content={initialData.content}
                setEditor={setEditor}
                teacherView={true}
              />
            )}

            <div className="flex items-center gap-x2">
              <Button type="submit" color="primary" disabled={isPending}>
                {t("saveChange")}
              </Button>
            </div>
          </form>
        )}
      </FormContainer>
    </div>
  );
};
