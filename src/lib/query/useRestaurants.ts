"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getRestaurants,
  getBestSeller,
  getRecommended,
  searchRestaurant,
} from "@/lib/api/restaurant";

import { QUERY_KEYS } from "./query-keys";
import { useAuthStore } from "@/store/auth";

/**
 * Semua restaurant
 */
export const useRestaurants = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RESTAURANTS, params],
    queryFn: () => getRestaurants(params),
  });
};

/**
 * Search restaurant by nama
 */
export const useSearchRestaurants = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANT_SEARCH(query),
    queryFn: () => searchRestaurant(query),
    enabled: query.trim().length > 0,
  });
};

/**
 * Best seller
 */
export const useBestSeller = () => {
  return useQuery({
    queryKey: QUERY_KEYS.BEST_SELLER,
    queryFn: getBestSeller,
  });
};

/**
 * Recommended
 */
export const useRecommended = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDED,
    queryFn: getRecommended,
    enabled: !!token,
  });
};
