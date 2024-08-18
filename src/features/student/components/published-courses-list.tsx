"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useGetPublishedCourses } from "../data/use-get-published-courses";
import { CourseCard } from "./course-card";
import { CourseCardSkeleton } from "./course-card-skeleton";

type Props = {};
export const PublishedCoursesList = ({}: Props) => {
  const { data, isLoading } = useGetPublishedCourses();
  const t = useTranslations("Navigation");

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {Array.from({ length: 8 }).map((_, index) => {
          return <CourseCardSkeleton key={index} />;
        })}
      </div>
    );
  }
  if (!data) {
    return <div>No data</div>;
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
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
      {data.map((course) => {
        return <CourseCard key={course.id} course={course} />;
      })}
    </div>
  );
};
