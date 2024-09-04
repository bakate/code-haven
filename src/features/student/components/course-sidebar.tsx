"use client";

import { MoveBackButton } from "@/components/go-back-button";
import { LocalSwitcherSelect } from "@/components/local-switcher-select";
import { Logo } from "@/components/logo";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { Progress } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import {
  SingleCourse,
  useGetSingleCourseById,
} from "../data/use-get-single-course-by-id";
import { Category } from "../types/category.type";
import { formatSeconds } from "../utils/format-seconds";
import {
  CourseSidebarItem,
  CourseSidebarItemSkeleton,
} from "./course-sidebar-item";

type Props = {
  courseId: string;
  isAuthenticated: boolean;
};

const getCourseWithTranslations = (
  course: SingleCourse,
  lang: string,
  categories: Category[]
) => {
  const category = categories.find(
    (category) => category.id === course.categoryId
  );
  const courseWithTranslations = {
    id: course.id,
    price: course.price,
    imageUrl: course.imageUrl,
    category: category?.name ?? "",
    attachments: course.attachments,
    title:
      course.courseTranslations.find((translation) => translation.lang === lang)
        ?.title ?? "",
    description:
      course.courseTranslations.find((translation) => translation.lang === lang)
        ?.description ?? "",
    chapters: course.chapters.map((chapter) => ({
      id: chapter.id,
      title:
        chapter.chapterTranslations.find(
          (translation) => translation.lang === lang
        )?.title ?? "",
      description:
        chapter.chapterTranslations.find(
          (translation) => translation.lang === lang
        )?.description ?? "",
      isFree: chapter.isFree,
      isCompleted:
        chapter.lessonProgressions.find(
          (progression) => progression.chapterId === chapter.id
        )?.isCompleted ?? false,
      duration: chapter.muxData?.duration ?? 0,
    })),
    userProgress: course.courseProgressions[0]?.progressPercentage ?? 0,
  };
  return courseWithTranslations;
};

export const CourseSidebar = ({ courseId, isAuthenticated }: Props) => {
  const { data: course, isLoading } = useGetSingleCourseById(courseId);
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const locale = useLocale();
  const t = useTranslations("studentCourseById");

  if (isLoading || categoriesLoading) return <div>{t("loading")}</div>;
  if (!course || !categories) return <div>{t("noData")}</div>;

  const courseWithTranslations = getCourseWithTranslations(
    course,
    locale,
    categories
  );

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] pb-2">
      <Logo />

      <div className="pt-4">
        <MoveBackButton className="pl-2" />
        <h1 className="font-semibold pt-3 pb-4 px-2">
          {courseWithTranslations.title}
        </h1>

        {courseWithTranslations.userProgress > 0 ? (
          <Progress
            aria-label={t("courseProgress")}
            size="sm"
            label={t("courseProgress")}
            showValueLabel={true}
            value={courseWithTranslations.userProgress}
            color={
              courseWithTranslations.userProgress === 100
                ? "success"
                : "primary"
            }
            className="max-w-md px-2 pb-4 italic text-small text-slate-500"
          />
        ) : null}

        {courseWithTranslations.chapters.map((chapter, i) => (
          <CourseSidebarItem
            courseId={courseWithTranslations.id}
            id={chapter.id}
            isCompleted={chapter.isCompleted}
            isLocked={!chapter.isFree}
            label={chapter.title}
            duration={formatSeconds(Number(chapter.duration))}
            key={i}
          />
        ))}
      </div>
      <div className="flex justify-center items-center px-2 gap-x-3">
        <LocalSwitcherSelect />
        {isAuthenticated ? <UserButton /> : null}
      </div>
    </div>
  );
};

export const CourseSidebarSkeleton = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] pb-2">
      <div className="px-2">
        <Logo />
      </div>
      <div className="w-full h-16 pt-4 pl-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseSidebarItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
