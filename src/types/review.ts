export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment?: string;
  menuIds?: number[];
}
