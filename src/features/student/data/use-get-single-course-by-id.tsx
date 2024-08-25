import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type SingleCourse = InferResponseType<
  (typeof honoClient.api.courses)[":id"]["$get"],
  200
>["data"];

export const useGetSingleCourseById = (courseId: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ["learn", { courseId }],
    queryFn: async () => {
      const response = await honoClient.api.courses[":id"].$get({
        param: {
          id: courseId,
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
