import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type SingleChapterType = InferResponseType<
  (typeof honoClient.api.chapters)[":id"]["$get"],
  200
>["data"];

export const useGetChapterById = (chapterId: string, courseId: string) => {
  const query = useQuery({
    enabled: !!chapterId,
    queryKey: ["chapter", { chapterId }],
    queryFn: async () => {
      const response = await honoClient.api.chapters[":id"].$get({
        param: {
          id: chapterId,
        },
        query: {
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

export const useVideoStatus = (chapterId: string) => {
  return useQuery({
    queryKey: ["videoStatus", { chapterId }],
    enabled: !!chapterId,
    queryFn: async () => {
      const response = await honoClient.api.chapters["video-status"].$get({
        query: {
          id: chapterId,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const { status } = await response.json();
      return status;
    },
    refetchInterval: (query) => {
      if (query.state.data && query.state.data === "processing") {
        return 5000;
      }
      return false;
    },
    notifyOnChangeProps: ["data"],
    refetchIntervalInBackground: true,
  });
};
