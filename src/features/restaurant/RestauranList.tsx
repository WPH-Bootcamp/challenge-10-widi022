"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import RestaurantCard from "@/components/shared/RestaurantCard";
import SearchBar from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import {
  useBestSeller,
  useRecommended,
  useRestaurants,
  useSearchRestaurants,
} from "@/lib/query/useRestaurants";
import type { Restaurant } from "@/types/restaurant";

type RestaurantApiResponse = {
  data?: Restaurant[] | { data?: Restaurant[] };
};

function getRestaurantItems(response: RestaurantApiResponse | undefined) {
  if (!response?.data) return [];
  return Array.isArray(response.data) ? response.data : response.data.data ?? [];
}

function RestaurantGrid({
  title,
  restaurants,
  emptyText,
  variant = "default",
}: {
  title: string;
  restaurants: Restaurant[];
  emptyText: string;
  variant?: "default" | "recommended";
}) {
  const isRecommended = variant === "recommended";

  return (
    <section className={isRecommended ? "space-y-6" : "space-y-4"}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={isRecommended ? "text-2xl font-bold" : "text-xl font-bold"}>
          {title}
        </h2>
        {isRecommended ? (
          <Link href="/category" className="text-sm font-bold text-red-600 hover:text-red-700">
            See All
          </Link>
        ) : null}
      </div>

      {restaurants.length > 0 ? (
        <>
          <div
            className={
              isRecommended
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            }
          >
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant={isRecommended ? "compact" : "default"}
              />
            ))}
          </div>

          {isRecommended ? (
            <div className="flex justify-center pt-2">
              <Button
                asChild
                variant="outline"
                className="h-10 min-w-32 rounded-full px-6 font-bold"
              >
                <Link href="/category">Show More</Link>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
    </section>
  );
}

type RestaurantListProps = {
  showSearch?: boolean;
};

/**
 * Home Restaurant List
 */
export default function RestaurantList({ showSearch = true }: RestaurantListProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
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
  const searchQuery = useSearchRestaurants(keyword);
  const recommendedQuery = useRecommended();
  const bestSellerQuery = useBestSeller();

  const isSearching = keyword.trim().length > 0;

  if (
    restaurantsQuery.isLoading ||
    bestSellerQuery.isLoading ||
    (isSearching && searchQuery.isLoading)
  ) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-56 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (restaurantsQuery.isError || bestSellerQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Data restaurant gagal dimuat. Coba refresh halaman.
      </div>
    );
  }

  const restaurants = getRestaurantItems(restaurantsQuery.data);
  const searchResults = getRestaurantItems(searchQuery.data);
  const recommended = getRestaurantItems(recommendedQuery.data);
  const bestSeller = getRestaurantItems(bestSellerQuery.data);
  const recommendedItems =
    recommended.length > 0
      ? recommended
      : bestSeller.length > 0
        ? bestSeller
        : restaurants;

  return (
    <div className="space-y-10">
      {showSearch ? <SearchBar /> : null}

      {isSearching ? (
        <RestaurantGrid
          title={`Hasil pencarian "${keyword}"`}
          restaurants={searchResults}
          emptyText="Restaurant tidak ditemukan."
        />
      ) : (
        <>
          <RestaurantGrid
            title="Recommended"
            restaurants={recommendedItems.slice(0, 12)}
            emptyText="Belum ada rekomendasi tersedia."
            variant="recommended"
          />

          <RestaurantGrid
            title="Best Seller"
            restaurants={bestSeller}
            emptyText="Best seller belum tersedia."
          />

          <RestaurantGrid
            title="Semua Restaurant"
            restaurants={restaurants}
            emptyText="Belum ada restaurant tersedia."
          />
        </>
      )}
    </div>
  );
}
