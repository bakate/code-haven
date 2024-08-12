import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export type ResponseType = InferResponseType<
  (typeof honoClient.api.chapters)[":id"]["$delete"]
>;

export type RequestType = InferRequestType<
  (typeof honoClient.api.chapters)[":id"]["$delete"]
>;

export const useDeleteChapterById = (chapterId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.chapters[":id"].$delete({
        param: {
          id: chapterId,
        },
        query: {
          courseId: json.query.courseId,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    onSuccess: (data) => {

      if (data.status === "success") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["teacher", { courseId: data.courseId }],
        });

      }

    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
