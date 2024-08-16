"use client";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { Link, Skeleton } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import {
  LuArrowLeft,
  LuEuro,
  LuEye,
  LuFile,
  LuLayoutDashboard,
  LuListChecks,
  LuVideo,
} from "react-icons/lu";
import { ChapterAccessSettingsForm } from "../components/chapter/chapter-access-settings-form";
import { ChapterActions } from "../components/chapter/chapter-actions";
import { ChapterDescriptionForm } from "../components/chapter/chapter-description-form";
import { ChapterTitleForm } from "../components/chapter/chapter-title-form";
import { ChapterVideoForm } from "../components/chapter/chapter-video-form";
import {
  useGetChapterById,
  useVideoStatus,
} from "../data/use-get-chapter-by-id";
import {
  FullWidthSkeleton,
  SkeletonWithIcon,
} from "../components/custom-skeletons";

type Props = {
  params: {
    courseId: string;
    chapterId: string;
  };
};
export const EditChapterScreen = ({ params }: Props) => {
  const {
    data: chapter,
    isError,
    isFetching,
  } = useGetChapterById(params.chapterId, params.courseId);
  const { data: videoStatus } = useVideoStatus(params.chapterId);
  const locale = useLocale();
  const t = useTranslations("createOrEditCourseForm");
  if (isError) {
    return <div>Error</div>;
  }
  if (isFetching) {
    return <ChapterSkeleton />;
  }
  if (!chapter) {
    return redirect("/");
  }

  const chapterTranslation = chapter.titlesAndDescriptions.find(
    (chapterTranslation) => chapterTranslation.lang === locale
  );

  if (!chapterTranslation) {
    return redirect("/");
  }

  const requiredFields = [
    chapterTranslation.title,
    chapterTranslation.description,
    chapter.playbackId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished ? (
        <Banner variant={"warning"} label={t("unpublishedWarning")} />
      ) : null}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-small hover:opacity-75 transition mb-6"
            >
              <LuArrowLeft />
              {t("backToCourseSetup")}
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">{t("chapterCreation")}</h1>
                <span className="text-small text-slate-700 dark:text-slate-200">
                  {t("completeAllFields")} {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete || isFetching}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LuLayoutDashboard} />
                <h2 className="text-xl">{t("customizeYourChapter")}</h2>
              </div>
              <ChapterTitleForm
                initialData={{
                  chapterId: chapter.id,
                  title: chapterTranslation.title,
                  courseId: chapter.courseId,
                }}
              />
              <ChapterDescriptionForm
                initialData={{
                  chapterId: chapter.id,
                  description: chapterTranslation.description,
                  courseId: chapter.courseId,
                  title: chapterTranslation.title,
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LuEye} />
                <h2 className="text-xl">{t("accessSettings")}</h2>
              </div>
              <ChapterAccessSettingsForm
                initialData={{
                  chapterId: chapter.id,
                  title: chapterTranslation.title,
                  isFree: chapter.isFree,
                  courseId: chapter.courseId,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LuVideo} />
              <h2 className="text-xl">{t("addVideo")}</h2>
            </div>
            <ChapterVideoForm
              initialData={{
                chapterId: chapter.id,
                playbackId: chapter.playbackId ?? "",
                title: chapterTranslation.title,
                courseId: chapter.courseId,
                videoStatus: videoStatus ?? null,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ChapterSkeleton = () => (
  <div className="p-6">
    <FullWidthSkeleton />
    <div className="flex items-center justify-between mt-6">
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-16 rounded-lg w-[300px] md:w-[400px]" />
        <Skeleton className="h-12 rounded-lg w-[300px] md:w-[550px]" />
      </div>
      <div className="flex items-center gap-x-2">
        <Skeleton className="w-24 h-10 rounded-lg" />
        <Skeleton className="w-24 h-10 rounded-lg" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6 mt-16">
      <div className="space-y-6">
        <SkeletonWithIcon icon={LuLayoutDashboard} />
        <FullWidthSkeleton height="h-12" />
        {[1, 2].map((index) => (
          <FullWidthSkeleton key={index} height={"h-32"} />
        ))}
      </div>

      <div className="space-y-6">
        {[{ icon: LuVideo }].map(({ icon }, index) => (
          <div key={index} className="space-y-6">
            <SkeletonWithIcon icon={icon} />
            <FullWidthSkeleton height={"h-[350px]"} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
