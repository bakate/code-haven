"use client";
import { Link } from "@nextui-org/react";
import { useGetCoursesByTeacher } from "../data/use-get-courses-by-teacher";

export const TeacherCoursesScreen = () => {
  const { data, isError, isLoading, isFetched } = useGetCoursesByTeacher();
  if (isLoading || !isFetched) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div>
      {data.map((course) => (
        <div key={course.id}>
          <Link href={`/teacher/courses/${course.id}`}>
            <h1>{course.id}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};
