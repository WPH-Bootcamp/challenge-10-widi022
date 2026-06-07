"use client";

import { useSearchParams } from "next/navigation";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { useRestaurants } from "@/lib/query/useRestaurants";
import type { Restaurant } from "@/types/restaurant";

type RestaurantApiResponse = {
  data?: Restaurant[] | { data?: Restaurant[] };
};

function getRestaurantItems(response: RestaurantApiResponse | undefined) {
  if (!response?.data) return [];
  return Array.isArray(response.data) ? response.data : response.data.data ?? [];
}

export default function CategoryRestaurantList() {
  const searchParams = useSearchParams();
  const restaurantParams = {
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("limit") ?? "8",
    range: searchParams.get("range") ?? "",
    priceMin: searchParams.get("priceMin") ?? "",
    priceMax: searchParams.get("priceMax") ?? "",
    rating: searchParams.get("rating") ?? "",
    category: searchParams.get("category") ?? "",
  };
  const cleanedParams = Object.fromEntries(
    Object.entries(restaurantParams).filter(([, value]) => value !== ""),
  );
  const restaurantsQuery = useRestaurants(cleanedParams);

  if (restaurantsQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (restaurantsQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Data restaurant gagal dimuat. Coba refresh halaman.
      </div>
    );
  }

  const restaurants = getRestaurantItems(restaurantsQuery.data);

  return restaurants.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          variant="compact"
        />
      ))}
    </div>
  ) : (
    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      Restaurant tidak ditemukan.
    </div>
  );
}
