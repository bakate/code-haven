import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export type ResponseType = InferResponseType<
  (typeof honoClient.api.chapters)[":id"]["$patch"]
>;

export type RequestType = InferRequestType<
  (typeof honoClient.api.chapters)[":id"]["$patch"]
>["json"];

export const useEditChapterById = (chapterId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.chapters[":id"].$patch({
        param: {
          id: chapterId,
        },
        json,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["chapter", { chapterId }],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
