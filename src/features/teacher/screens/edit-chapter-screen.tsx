"use client";
import { Banner } from "@/components/banner";
import { Heading } from "@/components/heading";
import { Link, Skeleton } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { LuArrowLeft, LuLayoutDashboard, LuVideo } from "react-icons/lu";
import { ChapterActions } from "../components/chapter/chapter-actions";
import { ChapterAttachmentsForm } from "../components/chapter/chapter-attachments-form";
import { ChapterContentForm } from "../components/chapter/chapter-content-form";
import { ChapterDescriptionForm } from "../components/chapter/chapter-description-form";
import { ChapterTitleForm } from "../components/chapter/chapter-title-form";
import { ChapterVideoForm } from "../components/chapter/chapter-video-form";
import {
  FullWidthSkeleton,
  SkeletonWithIcon,
} from "../components/custom-skeletons";
import {
  useGetChapterById,
  useVideoStatus,
} from "../data/use-get-chapter-by-id";

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
    // TODO rework this
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
              <Heading
                className="text-2xl md:text-3xl"
                level="h1"
                description={`${t("completeAllFields")} ${completionText}`}
              >
                {t("chapterCreation")}
              </Heading>

              <ChapterActions
                disabled={!isComplete || isFetching}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        {/* main layout */}
        <div className="grid gap-6 mt-16 lg:grid-cols-2 lg:grid-rows-3 pb-2 lg:pb-8">
          {/* Title and description */}
          <div className="row-span-1 lg:row-span-3 lg:space-y-12">
            {/* <div className="space-y-2 h-64">
              <div className="lg:row-span-3 row-span-1 grid items-stretch"> */}
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
            <ChapterAttachmentsForm
              initialData={{
                chapterId: chapter.id,
                attachments: chapter.attachments,
                title: chapterTranslation.title,
              }}
            />
            {/* </div>
            </div> */}
          </div>

          {/* Video and attachments */}
          <div className="row-span-2 lg:row-span-3">
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

          {/* Content */}
          <div className="row-span-2 lg:col-span-2  w-full">
            <ChapterContentForm
              initialData={{
                chapterId: chapter.id,
                content: chapter.content,
                courseId: chapter.courseId,
                title: chapterTranslation.title,
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
