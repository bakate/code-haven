"use client";

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  LuEuro,
  LuFile,
  LuLayoutDashboard,
  LuListChecks,
} from "react-icons/lu";
import { AttachmentsForm } from "../components/attachments-form";
import { CategoryForm } from "../components/category-form";
import { ChaptersForm } from "../components/chapters-form";
import { CourseActions } from "../components/course-actions";
import { DescriptionForm } from "../components/description-form";
import { ImageForm } from "../components/image-form";
import { PriceForm } from "../components/price-form";
import { TitleForm } from "../components/title-form";
import { useGetCategories } from "../data/use-get-categories";
import { useGetTeacherCourseById } from "../data/use-get-teacher-course-by-id";

type Props = {
  courseId: string;
};
export const TeacherCourseById = ({ courseId }: Props) => {
  const t = useTranslations("teacherCourseById");
  const locale = useLocale();
  const categoriesQuery = useGetCategories();

  const categoriesTranslated = useMemo(() => {
    return categoriesQuery.data?.map((category) => {
      const translatedCategory = category.names.find(
        (name) => name.lang === locale
      );
      if (translatedCategory) {
        return {
          value: category.id,
          label: translatedCategory.name,
        };
      }
      return {
        value: category.id,
        label: category.id,
      };
    });
  }, [locale, categoriesQuery.data]);

  const {
    data: course,
    isLoading,
    isError,
  } = useGetTeacherCourseById(courseId);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  if (!course) {
    return <div>No data</div>;
  }

  const translatedTitleAndDescription = course.titles.find(
    (title) => title.lang === locale
  );
  const translatedChapter = (course.chapters ?? []).find((chapter) => {
    return chapter.lang === locale;
  });

  const requiredFields = [
    translatedTitleAndDescription?.title,
    translatedTitleAndDescription?.description,
    course.categoryId,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.attachments,
  ];

  const totalFields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const completionText = `(${filledFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished ? <Banner label={t("unpublishedBanner")} /> : null}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">{t("courseSetup")}</h1>
            <span className="text-sm text-slate-700">
              {t("completeAllFields")} {completionText}
            </span>
          </div>
          <CourseActions
            disabled={isLoading}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LuLayoutDashboard} />
              <h2 className="text-xl">{t("customizeYourCourse")}</h2>
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
              options={categoriesTranslated}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LuListChecks} />
                <h2 className="text-xl">{t("courseChapters")}</h2>
              </div>
              <ChaptersForm
                initialData={{
                  courseId: course.id,
                  title: translatedChapter?.title ?? "",
                }}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <IconBadge icon={LuEuro} />
              <h2 className="text-xl">{t("sellYourCourse")}</h2>
            </div>
            <PriceForm
              initialData={{
                courseId: course.id,
                price: course.price ? String(course.price) : undefined,
                title: translatedTitleAndDescription?.title ?? "",
              }}
            />
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LuFile} />
                <h2 className="text-xl">{t("resourcesAndAttachments")}</h2>
              </div>
              <AttachmentsForm
                initialData={{
                  courseId: course.id,
                  attachments: course.attachments ?? [],
                  title: translatedTitleAndDescription?.title ?? "",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
