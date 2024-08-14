"use client";

import { Button, Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useState } from "react";
import { FaImage, FaPencil, FaPlus } from "react-icons/fa6";
import { useEditCourseByTeacher } from "../data/use-edit-course-by-teacher";
import FileUpload from "./file-upload";

type Props = {
  initialData: {
    courseId: string;
    imageUrl?: string;
    title: string;
  };
};

export const ImageForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useEditCourseByTeacher(initialData.courseId);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const t = useTranslations("createOrEditCourseForm");

  const readOnlyWithoutImage = !isEditing && !initialData.imageUrl;
  const readOnlyWithImage = !isEditing && initialData.imageUrl;

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md">
      <div className="font-medium flex items-center justify-between">
        {t("courseImage")}
        <Button
          variant="ghost"
          color="primary"
          onPress={toggleEditing}
          disabled={isPending}
          startContent={
            readOnlyWithImage ? (
              <FaPencil />
            ) : readOnlyWithoutImage ? (
              <FaPlus />
            ) : null
          }
        >
          {isEditing ? t("cancel") : null}
          {readOnlyWithoutImage
            ? t("addImage")
            : readOnlyWithImage
              ? t("editImage")
              : ""}
        </Button>
      </div>
      {readOnlyWithoutImage ? (
        <div className="flex items-center justify-center mt-4 h-60 bg-slate-200 rounded-md">
          <FaImage className="size-10 text-slate-500" />
        </div>
      ) : readOnlyWithImage ? (
        <div className="relative aspect-video mt-4">
          <Image
            as={NextImage}
            src={initialData.imageUrl}
            alt="Course image"
            isBlurred
            width={900}
            height={400}
            className="object-cover rounded-md w-full"
          />
        </div>
      ) : null}
      {isEditing ? (
        <FileUpload
          endpoint="courseImage"
          onChange={(url) => {
            if (url) {
              mutate(
                {
                  imageUrl: url,
                },
                {
                  onSuccess: () => {
                    toggleEditing();
                  },
                }
              );
            }
          }}
        />
      ) : null}
    </div>
  );
};
