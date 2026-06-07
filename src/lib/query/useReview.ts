"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/lib/api/review";
import { QUERY_KEYS } from "@/lib/query/query-keys";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESTAURANT(String(variables.restaurantId)),
      });
    },
  });
};
