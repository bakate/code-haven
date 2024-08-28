"use client";

import { Banner } from "@/components/banner";
import { VideoPlayer } from "@/features/student/components/video-player";
import { useGetChapterById } from "@/features/teacher/data/use-get-chapter-by-id";
import { Button, Divider } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { LuArrowRight } from "react-icons/lu";
import { useCreateUserProgression } from "../data/use-create-user-progression";
import { useEditUserProgression } from "../data/use-edit-user-progression";

type Props = {
  courseId: string;
  chapterId: string;
};

export const SingleCourseScreen = ({ courseId, chapterId }: Props) => {
  const { data: chapter, isLoading } = useGetChapterById(chapterId, courseId);
  const { mutate: editUserProgression } = useEditUserProgression(courseId);
  const { mutate: createUserProgression } = useCreateUserProgression(chapterId);
  const locale = useLocale();
  const t = useTranslations("studentCourseById");
  const router = useRouter();

  const videoPlayerRef = useRef<{ seekToEnd: () => void } | null>(null);

  if (isLoading) return <div>{t("loading")}</div>;
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
            isCompleted={chapter.isCompleted}
            courseId={courseId}
            chapterId={chapterId}
            nextChapterId={chapter.nextChapterId}
            onEnd={(currentTime, isCompleted) =>
              adjustUserProgression(currentTime, isCompleted)
            }
            onStart={handleCreateUserProgression}
            onPause={(currentTime, isCompleted) =>
              adjustUserProgression(currentTime, isCompleted)
            }
            ref={videoPlayerRef}
            areOtherChaptersCompleted={chapter.allPreviousChaptersCompleted}
          />
        </div>
        <div className="p-4 flex flex-cols md:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold pb-2">
            {chapterTranslation?.title}
          </h2>
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
        <Divider />
      </div>
    </div>
  );
};
