import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

export type PublishedCourseType = InferResponseType<
  (typeof honoClient.api.courses)["$get"],
  200
>["data"];

export const useGetPublishedCourses = () => {
  const params = useSearchParams();
  const categories = params?.get("categories") || "";
  const title = params?.get("title") || "";

  const query = useQuery({
    queryKey: ["student", { categories, title }],
    queryFn: async () => {
      const response = await honoClient.api.courses.$get({
        query: {
          categories,
          title,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
