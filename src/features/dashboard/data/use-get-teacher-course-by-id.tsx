import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof honoClient.api.teacher)["$get"],
  200
>;

export const useGetTeacherCourseById = (courseId: string) => {
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
