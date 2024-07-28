import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof honoClient.api.chapters.reorder.$patch
>;
type RequestType = InferRequestType<
  typeof honoClient.api.chapters.reorder.$patch
>["json"];

export const useReorderChapters = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.chapters.reorder.$patch({
        json,
      });
      return response.json();
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success(res?.message);
        queryClient.invalidateQueries({
          queryKey: ["teacher", { courseId: res.courseId }],
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
