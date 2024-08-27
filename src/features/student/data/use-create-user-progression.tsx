import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { honoClient } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof honoClient.api.courses)[":id"]["progression"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.courses)[":id"]["progression"]["$post"]
>["param"];

export const useCreateUserProgression = (chapterId: string) => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.courses[":id"]["progression"][
        "$post"
      ]({
        param: {
          id: json.id,
        },
        query: {
          chapterId: chapterId,
        },
      });
      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
