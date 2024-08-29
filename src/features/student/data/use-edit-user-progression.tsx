import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof honoClient.api.courses)[":id"]["progression"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.courses)[":id"]["progression"]["$patch"]
>["json"];

export const useEditUserProgression = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.courses[":id"]["progression"][
        "$patch"
      ]({
        param: {
          id: courseId,
        },
        json: {
          videoPlaybackPosition: json.videoPlaybackPosition,
          isCompleted: json.isCompleted,
          chapterId: json.chapterId,
        },
      });
      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", { chapterId: response.chapterId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["learn", { courseId }],
      });
    },
  });
};
