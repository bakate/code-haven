"use client";

import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { categoryIconMap } from "../types/category-icon-mapping";
import { CategoryItem } from "./category-item";

export const CategoryList = () => {
  const categoriesQuery = useGetCategories();
  if (!categoriesQuery.data) return null;
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto py-2">
      {categoriesQuery.data.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={categoryIconMap[category.name]}
          value={category.id}
        />
      ))}
    </div>
  );
};
