import { api } from "./axios";
import type { CheckoutPayload, OrderQueryParams } from "@/types/order";

export const checkoutOrder = async (payload: CheckoutPayload) => {
  const { data } = await api.post("/order/checkout", payload);

  return data;
};

export const getMyOrders = async (params?: OrderQueryParams) => {
  const { data } = await api.get("/order/my-order", { params });

  return data;
};
