"use client";

import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuCheck, LuSendHorizonal } from "react-icons/lu";
import { useDeleteTeacherCourseById } from "../data/use-delete-teacher-course";
import { useEditTeacherCourseById } from "../data/use-edit-teacher-course";
import { ConfirmModal } from "./confirm-modal";

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
  const t = useTranslations("teacherCourseById");
  const { mutate, isPending } = useEditTeacherCourseById(courseId);
  const { mutate: onDeleteCourseMutation } = useDeleteTeacherCourseById(courseId);
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
      <ConfirmModal
        title={t("deleteCourse")}
        onConfirm={() => {
          onDeleteCourseMutation({
            param: {
              courseId
            }
          }, {
            onSuccess: (data) => {
              if (data.status === "success") {
                router.push(`/teacher/courses`)
              }
            }
          })

        }}>
        {t('deleteCourseConfirmation')}
      </ConfirmModal>
    </div>
  );
};
