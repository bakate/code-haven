import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.attachments.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.attachments.$post
>["json"];

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.attachments.$post({
        json,
      });
      return response.json();
    },
    onSuccess: ({ data, message }) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["teacher", { courseId: data.courseId }],
        });
        toast.success(message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
