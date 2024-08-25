import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type SinglePreviewCourse = InferResponseType<
  (typeof honoClient.api.preview)[":id"]["$get"],
  200
>["data"];

export const useGetSinglePreviewCourse = (courseId: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ["preview", { courseId }],
    queryFn: async () => {
      const response = await honoClient.api.preview[":id"].$get({
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
