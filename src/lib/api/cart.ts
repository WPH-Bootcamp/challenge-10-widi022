import { api } from "./axios";
import type { AddCartPayload, UpdateCartPayload } from "@/types/cart";

export const getCart = async () => {
  const { data } = await api.get("/cart");

  return data;
};

export const addCartItem = async (payload: AddCartPayload) => {
  const { data } = await api.post("/cart", payload);

  return data;
};

export const updateCartItem = async ({ id, quantity }: UpdateCartPayload) => {
  const { data } = await api.put(`/cart/${id}`, { quantity });

  return data;
};

export const deleteCartItem = async (id: string) => {
  const { data } = await api.delete(`/cart/${id}`);

  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart");

  return data;
};
