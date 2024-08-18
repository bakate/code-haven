import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type SingleCourseType = InferResponseType<
  (typeof honoClient.api.teacher)[':courseId']["$get"],
  200
>['data'];

export const useGetSingleCourseByTeacher = (courseId: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ["teacher", { courseId }],
    queryFn: async () => {
      const response = await honoClient.api.teacher[":courseId"].$get({
        param: {
          courseId,
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
