"use client";

import { useConfetti } from "@/hooks/use-confetti";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuCheck, LuSendHorizonal, LuTrash } from "react-icons/lu";
import { useMedia } from "react-use";
import { useDeleteCourseByTeacher } from "../data/use-delete-course-by-teacher";
import {
  EditCourseResponseType,
  useEditCourseByTeacher,
} from "../data/use-edit-course-by-teacher";

type ActionsProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};
export const CourseActions = ({
  courseId,
  disabled,
  isPublished,
}: ActionsProps) => {
  const t = useTranslations("createOrEditCourseForm");
  const { mutate, isPending } = useEditCourseByTeacher(courseId);
  const { mutate: onDeleteCourseMutation } = useDeleteCourseByTeacher();
  const { ConfirmationDialog, dialogResponse } = useConfirm({
    title: t("deleteCourse"),
    message: t("deleteCourseConfirmation"),
  });
  const isTablet = useMedia("(min-width: 640px)", false);

  const confetti = useConfetti();

  const handleCourseDeletion = async () => {
    const confirmed = await dialogResponse();
    if (confirmed) {
      onDeleteCourseMutation(
        {
          param: {
            courseId: courseId,
          },
        },
        {
          onSuccess: (data) => {
            if (data.status === "success") {
              router.push(`/teacher/courses`);
            }
          },
        }
      );
    }
  };

  const handlePublishCourse = () => {
    const options = {
      courseId,
      isPublished: !isPublished,
    };

    const onSuccess = (data: EditCourseResponseType) => {
      if (data.status === "success") {
        confetti.onOpen();
      }
    };

    mutate(options, !isPublished ? { onSuccess } : undefined);
  };

  const router = useRouter();

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onPress={handlePublishCourse}
        isDisabled={disabled || isPending}
        size="sm"
        variant="flat"
        isIconOnly={!isTablet}
        title={isPublished ? t("unpublish") : t("publish")}
        startContent={isPublished ? <LuCheck /> : <LuSendHorizonal />}
        color={isPublished ? "warning" : "primary"}
      >
        {!isTablet ? "" : isPublished ? t("unpublish") : t("publish")}
      </Button>
      <Button
        onPress={handleCourseDeletion}
        color="danger"
        isIconOnly={!isTablet}
        title={t("deleteCourse")}
        startContent={<LuTrash />}
        variant="flat"
        size="sm"
      >
        {!isTablet ? "" : t("delete")}
      </Button>
      <ConfirmationDialog />
    </div>
  );
};
