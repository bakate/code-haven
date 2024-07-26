import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.chapters.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.chapters.$post
>["json"];

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.chapters.$post({
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
