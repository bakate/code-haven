"use client";

import { Banner } from "@/components/banner";
import { VideoPlayer } from "@/features/student/components/video-player";
import { useGetChapterById } from "@/features/teacher/data/use-get-chapter-by-id";
import { Button, Divider, Link } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LuArrowRight, LuDownload } from "react-icons/lu";

import { Heading } from "@/components/heading";
import { NovelEditor } from "@/components/novel-editor/advanced-editor";
import { EditorInstance } from "novel";
import { useCreateUserProgression } from "../data/use-create-user-progression";
import { useEditUserProgression } from "../data/use-edit-user-progression";

type Props = {
  courseId: string;
  chapterId: string;
};

export const SingleCourseScreen = ({ courseId, chapterId }: Props) => {
  const {
    data: chapter,
    isLoading,
    isError,
  } = useGetChapterById(chapterId, courseId);
  const { mutate: editUserProgression } = useEditUserProgression(courseId);
  const { mutate: createUserProgression } = useCreateUserProgression(chapterId);
  const locale = useLocale();
  const t = useTranslations("studentCourseById");
  const router = useRouter();

  const videoPlayerRef = useRef<{ seekToEnd: () => void } | null>(null);
  const [editor, setEditor] = useState<EditorInstance | null>(null);

  if (isLoading) return <div>{t("loading")}</div>;
  // if (isError) return <div>{t("error")}</div>;
  if (!chapter) return <div>{t("noData")}</div>;

  const adjustUserProgression = (currentTime: number, isCompleted: boolean) => {
    editUserProgression({
      videoPlaybackPosition: currentTime,
      isCompleted,
      chapterId: chapterId,
    });
  };

  const handleCreateUserProgression = () => {
    createUserProgression({
      id: courseId,
    });
  };

  const handleCompleteAndContinue = () => {
    videoPlayerRef.current?.seekToEnd();
    router.push(`/courses/${courseId}/chapters/${chapter.nextChapterId}`);
  };

  // get chapter with translations
  const chapterTranslation = chapter.titlesAndDescriptions.find(
    (translation) => translation.lang === locale
  );
  const isLocked = !chapter.isFree;

  return (
    <div>
      {isLocked ? (
        <Banner label={t("lockedChapterLabel")} variant="warning" />
      ) : null}

      <div className="grid gap-4 pb-24">
        <div className="w-full">
          <VideoPlayer
            playbackId={chapter.playbackId!}
            title={chapterTranslation?.title!}
            isLocked={isLocked}
            lastVideoPosition={chapter.videoPlaybackPosition}
            courseId={courseId}
            chapterId={chapterId}
            onEnd={(currentTime, isCompleted) =>
              adjustUserProgression(currentTime, isCompleted)
            }
            onStart={handleCreateUserProgression}
            onPause={(currentTime, isCompleted) =>
              adjustUserProgression(currentTime, isCompleted)
            }
            ref={videoPlayerRef}
            areOtherChaptersCompleted={chapter.allOtherChaptersCompleted}
          />
        </div>
        <div className="p-4 flex flex-cols md:flex-row items-center justify-between gap-5">
          <Heading>{chapterTranslation?.title}</Heading>
          {chapter.nextChapterId ? (
            <Button
              variant="flat"
              color="primary"
              onPress={handleCompleteAndContinue}
              startContent={<LuArrowRight />}
            >
              {t("completeAndContinue")}
            </Button>
          ) : null}
        </div>
        {/* Add chapter attachments section */}
        {chapter.attachments?.length > 0 ? (
          <div className="mt-6">
            <Heading level="h3">{t("attachments")}</Heading>
            <div className="grid gap-2 mt-2">
              {chapter.attachments.map((attachment) => (
                <Link
                  download={attachment?.name}
                  key={attachment?.id}
                  showAnchorIcon
                  anchorIcon={<LuDownload className="ml-1" />}
                  href={attachment?.url}
                  isExternal
                >
                  {attachment?.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <Divider />
        {chapter.content ? (
          <NovelEditor
            content={chapter.content}
            teacherView={false}
            setEditor={setEditor}
          />
        ) : null}
      </div>
    </div>
  );
};
