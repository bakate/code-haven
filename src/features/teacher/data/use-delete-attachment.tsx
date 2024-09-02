import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export type ResponseType = InferResponseType<
  (typeof honoClient.api.attachments)[":id"]["$delete"]
>;

export type RequestType = InferRequestType<
  (typeof honoClient.api.attachments)[":id"]["$delete"]
>["param"];

export const useDeleteAttachmentById = ({
  courseId,
  chapterId,
}: {
  courseId?: string;
  chapterId?: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.attachments[":id"].$delete({
        param: {
          id: json.id,
        },
        json: {
          courseId: courseId ?? null,
          chapterId: chapterId ?? null,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["teacher", { courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter", { chapterId }],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
