"use client";

import { CategoryList } from "../components/category-list";
import { PublishedCoursesList } from "../components/published-courses-list";

export const AllCoursesScreen = () => {
  return (
    <div>
      <CategoryList />
      <PublishedCoursesList />
    </div>
  );
};
