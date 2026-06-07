"use client";

import { useQuery } from "@tanstack/react-query";

import { getRestaurant } from "@/lib/api/restaurant";

import { QUERY_KEYS } from "./query-keys";

/**
 * Detail restaurant
 */
export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANT(id),

    queryFn: () => getRestaurant(id),

    enabled: !!id,
  });
};
