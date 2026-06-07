"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/lib/api/cart";
import { QUERY_KEYS } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth";

export const useCart = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: getCart,
    enabled: !!token,
  });
};

export const useAddCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};
