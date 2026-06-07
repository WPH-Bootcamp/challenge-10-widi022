"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const distances = [
  { label: "Nearby", value: "1", option: "nearby" },
  { label: "Within 1 km", value: "1", option: "within-1" },
  { label: "Within 3 km", value: "3", option: "within-3" },
  { label: "Within 5 km", value: "5", option: "within-5" },
];

const ratings = ["5", "4", "3", "2", "1"];

export default function FilterSidebar({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/category?${params.toString()}`);
  };

  const setDistance = (range: string, option: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    params.set("distance", option);
    router.push(`/category?${params.toString()}`);
  };

  return (
    <aside
      className={
        mobile
          ? "min-h-full bg-white p-5"
          : "rounded-xl border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
      }
    >
      <h2 className="mb-5 text-xs font-bold">FILTER</h2>

      <FilterGroup title="Distance">
        <div className="space-y-2">
          {distances.map((distance, index) => (
            <label key={`${distance.label}-${index}`} className="flex gap-2 text-xs">
              <input
                type="radio"
                name="range"
                value={distance.value}
                checked={
                  searchParams.get("distance") === distance.option ||
                  (!searchParams.has("distance") &&
                    distance.option === "nearby" &&
                    searchParams.get("range") === distance.value)
                }
                onChange={() => setDistance(distance.value, distance.option)}
              />
              {distance.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="space-y-2">
          <PriceInput
            placeholder="Minimum Price"
            defaultValue={searchParams.get("priceMin") ?? ""}
            onBlur={(value) => setParam("priceMin", value)}
          />
          <PriceInput
            placeholder="Maximum Price"
            defaultValue={searchParams.get("priceMax") ?? ""}
            onBlur={(value) => setParam("priceMax", value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating} className="flex gap-2 text-xs">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={searchParams.get("rating") === rating}
                onChange={() => setParam("rating", rating)}
              />
              <span>★ {rating}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
}

function PriceInput({
  placeholder,
  defaultValue,
  onBlur,
}: {
  placeholder: string;
  defaultValue: string;
  onBlur: (value: string) => void;
}) {
  return (
    <div className="flex h-9 overflow-hidden rounded-lg border bg-white">
      <span className="grid w-10 place-items-center border-r bg-zinc-50 text-[10px]">
        Rp
      </span>
      <Input
        type="number"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-full rounded-none border-0 text-xs focus-visible:ring-0"
        onBlur={(event) => onBlur(event.target.value)}
      />
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-semibold">{title}</h3>
      {children}
    </section>
  );
}
