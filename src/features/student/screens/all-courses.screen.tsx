"use client";

import { CategoryList } from "../components/category-list";
import { PublishedCoursesList } from "../components/published-courses-list";

type Props = {};
export const AllCoursesScreen = ({}: Props) => {
  return (
    <div>
      <CategoryList />
      <PublishedCoursesList />
    </div>
  );
};
