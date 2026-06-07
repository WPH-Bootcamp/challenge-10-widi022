"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutOrder, getMyOrders } from "@/lib/api/order";
import { QUERY_KEYS } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth";
import type { OrderQueryParams } from "@/types/order";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });
};

export const useMyOrders = (params?: OrderQueryParams) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, params],
    queryFn: () => getMyOrders(params),
    enabled: !!token,
  });
};
