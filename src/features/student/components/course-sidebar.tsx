"use client";

import { Logo } from "@/components/logo";
import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { Link } from "@nextui-org/react";
import { useLocale } from "next-intl";
import {
  SingleCourse,
  useGetSingleCourseById,
} from "../data/use-get-single-course-by-id";
import { Category } from "../types/category.type";
import { formatSeconds } from "../utils/format-seconds";
import { CourseSidebarItem } from "./course-sidebar-item";

type Props = {
  courseId: string;
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
  };
  return courseWithTranslations;
};

export const CourseSidebar = ({ courseId }: Props) => {
  const { data: course, isLoading } = useGetSingleCourseById(courseId);
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const locale = useLocale();

  if (isLoading || categoriesLoading) return <div>Loading...</div>;
  if (!course || !categories) return <div>No data</div>;

  const courseWithTranslations = getCourseWithTranslations(
    course,
    locale,
    categories
  );

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] pb-2">
      <Link color="foreground" href="/" isBlock className="w-full h-16">
        <Logo />
        <p className="font-bold text-inherit text-[#007DFC] ml-2">Code Haven</p>
      </Link>

      <div className="space-y-3 pt-4">
        <h1 className="font-semibold pb-3 px-2">
          {courseWithTranslations.title}
        </h1>
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
    </div>
  );
};
