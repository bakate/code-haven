import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuCheck, LuSendHorizonal, LuTrash } from "react-icons/lu";
import { useDeleteChapterById } from "../../data/chapter/use-delete-chapter";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";

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
  const router = useRouter();

  const { ConfirmationDialog, dialogResponse } = useConfirm({
    title: t("deleteChapter"),
    message: t("deleteChapterConfirmation"),
  });

  const toggleChapterPublish = () => {
    if (isPublished) {
      mutate({
        courseId,
        isPublished: false,
      });
    } else {
      mutate({
        courseId,
        isPublished: true,
      });
    }
  };

  const handleChapterDeletion = async () => {
    const confirmed = await dialogResponse();
    if (confirmed) {
      onDeleteChapterMutation(
        {
          param: {
            id: chapterId,
          },
          query: {
            courseId,
          },
        },
        {
          onSuccess: (data) => {
            if (data.status === "success") {
              router.push(`/teacher/courses/${courseId}`);
            }
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onPress={toggleChapterPublish}
        isDisabled={disabled || isPending}
        startContent={isPublished ? <LuCheck /> : <LuSendHorizonal />}
        color={isPublished ? "success" : "primary"}
        size="sm"
      >
        {isPublished ? t("unpublish") : t("publish")}
      </Button>
      <Button
       onPress={handleChapterDeletion}
        color="danger"
        startContent={<LuTrash />}
        variant="flat"
        size="sm"
      >
        {t("delete")}
      </Button>
      <ConfirmationDialog />
    </div>
  )
};
