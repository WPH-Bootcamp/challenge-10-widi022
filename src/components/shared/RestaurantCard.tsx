"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";

type RestaurantCardProps = {
  restaurant: Restaurant;
  variant?: "default" | "compact";
};

export default function RestaurantCard({
  restaurant,
  variant = "default",
}: RestaurantCardProps) {
  const href = restaurant.id.startsWith("recommended-")
    ? "/category"
    : `/restaurant/${restaurant.id}`;
  const meta = [
    restaurant.address ?? "Jakarta Selatan",
    restaurant.distance ? `${restaurant.distance} km` : "2.4 km",
  ];

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="flex min-h-28 items-center gap-4 rounded-xl bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)]"
      >
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-[#f5ecdf]">
          {restaurant.image ? (
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <Image
              src="/images/Logo-merah.png"
              alt=""
              fill
              sizes="96px"
              className="object-contain p-5"
            />
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <h3 className="line-clamp-1 text-sm font-bold">{restaurant.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            {restaurant.rating ?? "4.9"}
          </span>
          <p className="line-clamp-1 text-xs text-zinc-700">{meta.join(" · ")}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-lg border bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-4/3 bg-muted">
        {restaurant.image ? (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold">
            {restaurant.name}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-medium">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {restaurant.rating ?? "-"}
          </span>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {restaurant.address ?? "Alamat belum tersedia"}
        </p>
      </div>
    </Link>
  );
}
