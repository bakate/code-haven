"use client";

import { IconBadge } from "@/components/icon-badge";
import { Loader } from "@/components/loader";
import { StartLearningButton } from "@/components/start-learning-button";
import { Divider } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { LuBookOpen } from "react-icons/lu";
import { useGetSinglePreviewCourse } from "../data/use-get-single-preview-course-by-id";
import { VideoPlayer } from "./video-player";

type Props = {
  courseId: string;
};
export const CoursePreview = ({ courseId }: Props) => {
  const { data: course, isLoading } = useGetSinglePreviewCourse(courseId);
  const t = useTranslations("coursesList");

  if (isLoading) return <Loader />;

  if (!course) {
    // TODO rework this
    return <div>No data</div>;
  }

  return (
    <div className="grid lg:grid-cols-5 gap-4 lg:gap-8 pb-24">
      <div className="flex flex-col gap-4 lg:col-span-3 col-span-1">
        <div className="w-full rounded-lg">
          <VideoPlayer
            lastVideoPosition={0}
            areOtherChaptersCompleted={false}
            playbackId={course.chapters[0].playbackId!}
            title={course.courseTranslation.title ?? ""}
            isLocked={!course.chapters[0].isFree}
            courseId={courseId}
            chapterId={course.chapters[0].id}
          />
        </div>

        <Divider />
        <div className="flex items-center gap-x-1 text-slate-500 dark:text-slate-300">
          <IconBadge size="sm" icon={LuBookOpen} />
          <span>{t("totalChapters", { count: course.totalChapters })}</span>
        </div>
        <h2 className="text-2xl font-bold pb-2">
          {course.courseTranslation.title}
        </h2>
        <p className="text-sm text-gray-500">
          {course.courseTranslation.description}
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1">
        <StartLearningButton
          courseId={courseId}
          chapterId={course.chapters[0].id}
        />
      </div>
    </div>
  );
};
