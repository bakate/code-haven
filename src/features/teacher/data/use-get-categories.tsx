import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type CategoriesType = InferResponseType<
  (typeof honoClient.api.categories)["$get"],
  200
>['data'];

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await honoClient.api.categories.$get();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
