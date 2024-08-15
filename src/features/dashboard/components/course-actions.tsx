"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuCheck, LuSendHorizonal, LuTrash } from "react-icons/lu";
import { useDeleteCourseByTeacher } from "../data/use-delete-course-by-teacher";
import { useEditCourseByTeacher } from "../data/use-edit-course-by-teacher";

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
    title: t('deleteCourse'),
    message: t('deleteCourseConfirmation')
  })

  const handleCourseDeletion = async () => {
    const confirmed = await dialogResponse();
    if (confirmed) {
      onDeleteCourseMutation({
        param: {
          courseId: courseId
        }
      }, {
        onSuccess: (data) => {
          if (data.status === "success") {
            router.push(`/teacher/courses`)
          }
        }
      });
    }
  }

  const router = useRouter();

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onPress={() => {
          mutate({
            courseId,
            isPublished: !isPublished
          });
        }}
        isDisabled={disabled || isPending}
        size="sm"
        startContent={
          isPublished ? <LuCheck /> : (
            <LuSendHorizonal />
          )
        }
        color={isPublished ? "success" : "primary"}
      >
        {isPublished ? t("unpublish") : t("publish")}
      </Button>
      <Button onPress={handleCourseDeletion} color="danger" startContent={<LuTrash />} variant="flat" size="sm">
        {t("delete")}

      </Button>
      <ConfirmationDialog />
    </div>
  );
};
