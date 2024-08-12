import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuCheck, LuSendHorizonal } from "react-icons/lu";
import { useDeleteChapterById } from "../../data/chapter/use-delete-chapter";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { ConfirmModal } from "../confirm-modal";

type Props = {
  isPublished: boolean;
  chapterId: string;
  courseId: string;
  disabled: boolean;
}
export const ChapterActions = ({ chapterId, courseId, disabled, isPublished }: Props) => {
  const { mutate, isPending } = useEditChapterById(chapterId);
  const { mutate: onDeleteChapterMutation } = useDeleteChapterById(chapterId);
  const t = useTranslations("createOrEditCourseForm");
  const router = useRouter()
  const handlePress = () => {
    if (isPublished) {
      mutate({
        courseId,
        isPublished: false
      });
    } else {
      mutate({
        courseId,
        isPublished: true
      });
    }
  };


  return (
    <div className="flex items-center gap-x-2">
      <Button onPress={handlePress} isDisabled={disabled || isPending}
        startContent={
          isPublished ? <LuCheck /> : (
            <LuSendHorizonal />
          )
        }
        color={isPublished ? "success" : "primary"} size="sm">
        {isPublished ? t("unpublish") : t("publish")}
      </Button>
      <ConfirmModal
        title={t('deleteChapter')}
        onConfirm={() => {
          onDeleteChapterMutation({
            param: {
              id: chapterId
            },
            query: {
              courseId,
            },
          }, {
            onSuccess: (data) => {
              if (data.status === "success") {
                router.push(`/teacher/courses/${courseId}`)
              }
            }
          })

        }}>
        {t('deleteChapterConfirmation')}
      </ConfirmModal>


    </div>
  );
}
