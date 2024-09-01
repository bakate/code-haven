"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import { HoverEffect } from "@/components/card-hover-effect";
import { Heading } from "@/components/heading";
import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { useState } from "react";
import { LuBookOpenCheck, LuCheck, LuClock } from "react-icons/lu";
import { useGetEnrolledCourses } from "../data/use-get-enrolled-courses";
import { CourseCard } from "./course-card";
import { InfoCard } from "./info-card";

type Props = {};
export const EnrolledCoursesList = ({}: Props) => {
  const t = useTranslations("studentCoursesReporting");
  const { data, isLoading, error } = useGetEnrolledCourses();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading || loadingCategories) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }
  if (!categories) {
    return <div>No categories</div>;
  }

  if (data.length === 0) {
    return (
      <Card
        shadow="md"
        className="group hover:scale-105 transition overflow-hidden border mt-7 h-28 md:h-64"
      >
        <CardBody className="h-full grid place-content-center">
          <p className="text-gray-500">{t("notStartedAnyCourse")}</p>
        </CardBody>
      </Card>
    );
  }

  const userKpis = data.reduce(
    (acc, course) => {
      acc.completedChapters += course.userProgress.completedChapters ?? 0;
      acc.completedCourses += course.userProgress.isCompleted ? 1 : 0;
      acc.inProgressCourses += course.userProgress.isCompleted ? 0 : 1;
      return acc;
    },
    {
      completedChapters: 0,
      totalChapters: 0,
      completedCourses: 0,
      inProgressCourses: 0,
    }
  );

  const {
    completedChapters: totalCompletedChapters,
    completedCourses: totalCompletedCourses,
    inProgressCourses: totalInProgressCourses,
  } = userKpis;

  return (
    <div>
      <Heading description={t("pageDescription")}>{t("title")}</Heading>
      <div className="space-y-14 mt-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <InfoCard
            icon={LuBookOpenCheck}
            label={t("completedChapters")}
            numberOfItems={totalCompletedChapters}
          />
          <InfoCard
            icon={LuClock}
            label={t("inProgressCourses")}
            numberOfItems={totalInProgressCourses}
          />
          <InfoCard
            icon={LuCheck}
            label={t("completedCourses")}
            numberOfItems={totalCompletedCourses}
          />
        </div>

        <div className="grid  sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8 mt-6 p-3">
          {data.map((course, idx) => {
            return (
              <HoverEffect
                key={`${course.id}-${idx}`}
                idx={idx}
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
              >
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    userProgress: course.userProgress.progressPercentage,
                  }}
                  categories={categories}
                />
              </HoverEffect>
            );
          })}
        </div>
      </div>
    </div>
  );
};
