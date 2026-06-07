import { api } from "./axios";
import type { CreateReviewPayload } from "@/types/review";

export const createReview = async (payload: CreateReviewPayload) => {
  const { data } = await api.post("/review", payload);

  return data;
};
