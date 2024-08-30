import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type EnrolledCourseType = InferResponseType<
  typeof honoClient.api.courses.enrolled.$get,
  200
>["data"];

export const useGetEnrolledCourses = () => {
  const query = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: async () => {
      const response = await honoClient.api.courses.enrolled.$get();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
