"use client";

import { useGetCategories } from "@/features/teacher/data/use-get-categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { categoryIconMap } from "../types/category-icon-mapping";
import { CategoryItem } from "./category-item";

export const CategoryList = () => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesQuery = useGetCategories();

  const currentCategories = searchParams?.get("categories")?.split(",") || [];
  const currentTitle = searchParams?.get("title");

  const handleCategorySelection = (categoryId: string) => {
    let newCategories;
    if (currentCategories.includes(categoryId)) {
      newCategories = currentCategories.filter((id) => id !== categoryId);
    } else {
      newCategories = [...currentCategories, categoryId];
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categories:
            newCategories?.length > 0 ? newCategories.join(",") : null,
          title: currentTitle,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  };

  if (!categoriesQuery.data) return null;
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto py-2">
      {categoriesQuery.data.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={categoryIconMap[category.name]}
          value={category.id}
          isActive={currentCategories.includes(category.id)}
          onClick={handleCategorySelection}
        />
      ))}
    </div>
  );
};
