import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof honoClient.api.teacher)["$get"],
  200
>;

export const useGetTeacherCourses = () => {
  const query = useQuery({
    queryKey: ["teacher"],
    queryFn: async () => {
      const response = await honoClient.api.teacher.$get();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
