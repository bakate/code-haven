"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";

import { HoverEffect } from "@/components/card-hover-effect";
import { Heading } from "@/components/heading";
import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuBookOpenCheck, LuCheck, LuClock, LuCompass } from "react-icons/lu";
import { useGetEnrolledCourses } from "../data/use-get-enrolled-courses";
import { CourseCard } from "./course-card";
import { CourseCardSkeleton } from "./course-card-skeleton";
import { InfoCard, InfoCardSkeleton } from "./info-card";

export const EnrolledCoursesList = () => {
  const t = useTranslations("studentCoursesReporting");
  const { data, isLoading, error } = useGetEnrolledCourses();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const router = useRouter();
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading || loadingCategories) {
    return <EnrolledCoursesListSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    // TODO rework this
    return <div>No data</div>;
  }
  if (!categories) {
    // TODO rework this
    return <div>No categories</div>;
  }

  if (data.length === 0) {
    return (
      <div className="h-[100dvh] grid place-items-center">
        <Card shadow="md" className="h-28 md:h-64 w-full">
          <CardBody className="h-full grid place-content-center gap-y-3 justify-items-center">
            <p className="text-gray-500">{t("notStartedAnyCourse")}</p>
            <Button
              color="primary"
              variant="flat"
              className="w-52 items-center"
              onPress={() => router.push("/")}
              startContent={<LuCompass />}
            >
              {t("ctaLabel")}
            </Button>
          </CardBody>
        </Card>
      </div>
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

const EnrolledCoursesListSkeleton = () => {
  return (
    <div className="space-y-14 mt-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <InfoCardSkeleton key={idx} />
        ))}
      </div>
      <div className="grid  sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8 mt-6 p-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <CourseCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};
