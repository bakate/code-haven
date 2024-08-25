"use client";

import { Banner } from "@/components/banner";
import { VideoPlayer } from "@/features/student/components/video-player";
import { useGetChapterById } from "@/features/teacher/data/use-get-chapter-by-id";
import { Divider } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  courseId: string;
  chapterId: string;
};

export const SingleCourseScreen = ({ courseId, chapterId }: Props) => {
  const { data: chapter, isLoading } = useGetChapterById(chapterId, courseId);
  const locale = useLocale();
  const t = useTranslations("studentCourseById");

  if (isLoading) return <div>{t("loading")}</div>;
  if (!chapter) return <div>{t("noData")}</div>;

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
            completeOnEnd={false}
            courseId={courseId}
            chapterId={chapterId}
            nextChapterId={""}
          />
        </div>
        <div className="p-4 flex flex-cols md:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold pb-2">
            {chapterTranslation?.title}
          </h2>
          <p className="text-sm text-gray-500">
            {chapterTranslation?.description}
          </p>
        </div>
        <Divider />
      </div>
    </div>
  );
};
