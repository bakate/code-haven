import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

export type PublishedCourseType = InferResponseType<
  (typeof honoClient.api.student)["search"]["$get"],
  200
>["data"];

export const useGetPublishedCourses = () => {
  const params = useSearchParams();
  const categoryId = params.get("categoryId") || "";
  const title = params.get("title") || "";

  const query = useQuery({
    queryKey: ["student", { categoryId, title }],
    queryFn: async () => {
      const response = await honoClient.api.student["search"].$get({
        query: {
          categoryId,
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
