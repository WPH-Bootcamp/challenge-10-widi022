"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80";

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const nextKeyword = keyword.trim();

    if (nextKeyword) {
      params.set("q", nextKeyword);
    } else {
      params.delete("q");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-90 overflow-hidden bg-zinc-950 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative mx-auto flex min-h-90 max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
          Explore Culinary Experiences
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/85">
          Search and refine your choice to discover the perfect restaurant.
        </p>
        <form
          onSubmit={handleSearch}
          className="mt-6 flex w-full max-w-xl items-center rounded-full bg-white p-1.5 shadow-lg"
        >
          <Search className="ml-3 size-4 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-zinc-900 outline-none"
            placeholder="Search restaurant, food, and drink"
          />
          <Button type="submit" size="pill">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
