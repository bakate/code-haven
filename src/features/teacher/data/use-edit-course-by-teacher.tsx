import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export type EditCourseResponseType = InferResponseType<
  (typeof honoClient.api.teacher)[":courseId"]["$patch"]
>;

export type RequestType = InferRequestType<
  (typeof honoClient.api.teacher)[":courseId"]["$patch"]
>["json"];

export const useEditCourseByTeacher = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<EditCourseResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.teacher[":courseId"].$patch({
        param: {
          courseId,
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
        queryKey: ["teacher", { courseId }],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
