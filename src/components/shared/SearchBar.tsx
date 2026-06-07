"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");

  /**
   * Search restaurant
   */
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
    <form onSubmit={handleSearch} className="flex w-full gap-2">
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Cari restaurant"
        className="h-10"
      />

      <Button type="submit" size="lg" aria-label="Search restaurant">
        <Search className="size-4" />
      </Button>
    </form>
  );
}
