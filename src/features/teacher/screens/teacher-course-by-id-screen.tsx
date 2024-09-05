"use client";

import { Banner } from "@/components/banner";
import { Heading } from "@/components/heading";
import { IconBadge } from "@/components/icon-badge";
import { Skeleton } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import {
  LuEuro,
  LuFile,
  LuLayoutDashboard,
  LuListChecks,
} from "react-icons/lu";
import { CategoryForm } from "../components/category-form";
import { ChaptersForm } from "../components/chapters-form";
import { CourseActions } from "../components/course-actions";
import {
  FullWidthSkeleton,
  SkeletonWithIcon,
} from "../components/custom-skeletons";
import { DescriptionForm } from "../components/description-form";
import { ImageForm } from "../components/image-form";
import { TitleForm } from "../components/title-form";
import { useGetCategories } from "../data/use-get-categories";
import { useGetSingleCourseByTeacher } from "../data/use-get-single-course-by-teacher";

type Props = {
  courseId: string;
};
export const TeacherCourseById = ({ courseId }: Props) => {
  const t = useTranslations("teacherCourseById");
  const locale = useLocale();
  const categoriesQuery = useGetCategories();

  const transformedCategories = useCallback(() => {
    return categoriesQuery.data?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [categoriesQuery.data]);

  const {
    data: course,
    isLoading,
    isError,
  } = useGetSingleCourseByTeacher(courseId);

  const translatedChapters = useCallback(() => {
    return (course?.chapters || []).filter((chapter) => {
      return chapter.lang === locale;
    });
  }, [course, locale]);

  if (isLoading) {
    return <CourseSkeleton />;
  }
  if (isError) {
    // TODO rework this
    return <div>Error</div>;
  }
  if (!course) {
    // TODO rework this
    return <div>No data</div>;
  }

  const translatedTitleAndDescription = course.titles.find(
    (title) => title.lang === locale
  );
  const isAtLeastOneChapterPublished = course.chapters.some(
    (chapter) => chapter.isPublished
  );

  const requiredFields = [
    translatedTitleAndDescription?.title,
    translatedTitleAndDescription?.description,
    course.categoryId,
    course.imageUrl,
    isAtLeastOneChapterPublished,
  ];

  const totalFields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const completionText = `(${filledFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished ? <Banner label={t("unpublishedBanner")} /> : null}

      <div className="flex items-center justify-between pb-6">
        <Heading
          level="h1"
          className="text-2xl md:text-3xl"
          description={`${t("completeAllFields")} ${completionText}`}
        >
          {t("courseSetup")}
        </Heading>

        <CourseActions
          disabled={!isComplete}
          courseId={courseId}
          isPublished={course.isPublished}
        />
      </div>

      {!isAtLeastOneChapterPublished ? (
        <Banner label={t("atLeastOneChapterPublished")} />
      ) : null}

      <div className="grid md:grid-cols-2 gap-6 mt-16 pb-8">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LuLayoutDashboard} />
            <Heading>{t("customizeYourCourse")}</Heading>
          </div>
          <TitleForm
            initialData={{
              courseId: course.id,
              title: translatedTitleAndDescription?.title ?? "",
            }}
          />
          <DescriptionForm
            initialData={{
              courseId: course.id,
              description: translatedTitleAndDescription?.description,
              title: translatedTitleAndDescription?.title ?? "",
            }}
          />
          <ImageForm
            initialData={{
              courseId: course.id,
              imageUrl: course.imageUrl ?? "",
              title: translatedTitleAndDescription?.title ?? "",
            }}
          />

          <CategoryForm
            initialData={{
              courseId: course.id,
              categoryId: course.categoryId ?? "",
              title: translatedTitleAndDescription?.title ?? "",
            }}
            options={transformedCategories ? transformedCategories() : []}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LuListChecks} />
              <Heading>{t("courseChapters")}</Heading>
            </div>
            <ChaptersForm
              initialData={{
                courseId: course.id,
                chapters: translatedChapters ? translatedChapters() : [],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// skeleton view
const CourseSkeleton = () => (
  <div className="p-6">
    <FullWidthSkeleton />
    <div className="flex items-center justify-between mt-6">
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-16 rounded-lg w-[300px]" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
      <Skeleton className="w-20 h-6 rounded-lg" />
    </div>
    <div className="grid md:grid-cols-2 gap-6 mt-16">
      <SkeletonWithIcon icon={LuLayoutDashboard} />
      <FullWidthSkeleton height="h-12" />

      {[1, 2, 3].map((index) => (
        <FullWidthSkeleton key={index} />
      ))}

      <Skeleton />

      <div className="space-y-6">
        {[{ icon: LuListChecks }, { icon: LuEuro }, { icon: LuFile }].map(
          ({ icon }, index) => (
            <div key={index} className="space-y-6">
              <SkeletonWithIcon icon={icon} />
              <FullWidthSkeleton />
            </div>
          )
        )}
      </div>
    </div>
  </div>
);
