"use client";
import { HoverEffect } from "@/components/card-hover-effect";
import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetPublishedCourses } from "../data/use-get-published-courses";
import { CourseCard } from "./course-card";
import { CourseCardSkeleton } from "./course-card-skeleton";

export const PublishedCoursesList = () => {
  const { data, isLoading } = useGetPublishedCourses();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const t = useTranslations("Navigation");
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading || loadingCategories) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 sm:gap-8 gap-4  mt-6 p-3">
        {Array.from({ length: 8 }).map((_, index) => {
          return <CourseCardSkeleton key={index} />;
        })}
      </div>
    );
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
      <Card
        shadow="md"
        className="group hover:scale-105 transition overflow-hidden border mt-7 h-28 md:h-64"
      >
        <CardBody className="h-full grid place-content-center">
          <p className="text-gray-500">{t("noCoursesFoundMessage")}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8 mt-6 p-3 py-10">
      {data.map((course, idx) => (
        <HoverEffect
          key={`${course.id}-${idx}`}
          idx={idx}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
        >
          <CourseCard course={course} categories={categories} />
        </HoverEffect>
      ))}
    </div>
  );
};
