import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.teacher.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.teacher.$post
>["json"];

export const useCreateCourseByTeacher = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.teacher.$post({
        json,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: ["teacher"] });
        router.push(`/teacher/courses/${data?.newCourseId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
