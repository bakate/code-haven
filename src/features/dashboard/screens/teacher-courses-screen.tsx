"use client";
import { useGetTeacherCourses } from "../data/use-get-teacher-courses";

export const TeacherCoursesScreen = () => {
  const { data, isError, isLoading, isFetched } = useGetTeacherCourses();
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
          <h1>{course.id}</h1>
        </div>
      ))}
    </div>
  );
};
