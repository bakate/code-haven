"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuFile, LuLoader2, LuPencil, LuPlus, LuX } from "react-icons/lu";

import { Heading } from "@/components/heading";
import { ImCancelCircle } from "react-icons/im";
import { useMedia } from "react-use";
import { useCreateAttachment } from "../../data/use-create-attachment";
import { useDeleteAttachmentById } from "../../data/use-delete-attachment";
import FileUpload from "../file-upload";
import { FormContainer } from "../form-container";

type Props = {
  initialData: {
    chapterId: string;
    imageUrl?: string;
    title: string;
    attachments: {
      name: string;
      url: string;
      id: string;
    }[];
  };
};

export const ChapterAttachmentsForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useCreateAttachment();
  const { mutate: deleteMutation, isPending: isDeleting } =
    useDeleteAttachmentById({
      chapterId: initialData.chapterId,
    });
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");
  const isTablet = useMedia("(min-width: 640px)", false);

  const readOnlyWithoutImage = !isEditing && !initialData.imageUrl;
  const readOnlyWithImage = !isEditing && initialData.imageUrl;

  const onSubmit = ({ url, name }: { url: string; name: string }) => {
    mutate(
      {
        name,
        url,
        chapterId: initialData.chapterId,
      },
      {
        onSuccess: () => {
          toggleEditing();
        },
      }
    );
  };

  const onDelete = (id: string) => {
    deleteMutation(
      {
        id,
      },
      {
        onSuccess: () => {
          setDeletingId(null);
        },
      }
    );
  };

  return (
    <FormContainer>
      <div className="font-medium flex items-center justify-between">
        <Heading level="h3">{t("chapterAttachments")}</Heading>
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          disabled={isPending || isDeleting}
          isIconOnly={!isTablet}
          startContent={
            readOnlyWithImage ? (
              <LuPencil />
            ) : readOnlyWithoutImage ? (
              <LuPlus />
            ) : (
              <ImCancelCircle />
            )
          }
        >
          {!isTablet ? "" : isEditing ? t("cancel") : t("addFile")}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {initialData.attachments?.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic">
              {t("noAttachmentsYet")}
            </p>
          ) : null}
          {initialData.attachments.length ? (
            <div className="space-y-2 mt-4">
              {initialData.attachments.map((attachment) => (
                <div
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:border-sky-700 dark:bg-sky-900 dark:text-sky-200"
                  key={attachment.id}
                >
                  <LuFile className="flex-shrink-0 mr-2 size-4" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <LuLoader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <Button
                      onClick={() => onDelete(attachment.id)}
                      type="button"
                      disabled={isDeleting}
                      color="danger"
                      className="ml-auto hover:opacity-75 transition size-4"
                      size="sm"
                      isIconOnly
                      variant="light"
                    >
                      <LuX className="size-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url && name) {
                onSubmit({ url, name });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            {t("addAnything")}
          </div>
        </div>
      )}
    </FormContainer>
  );
};
