"use client";

import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/shared/FilterSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CategoryFilters() {
  return (
    <>
      <div className="hidden md:block">
        <FilterSidebar />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-full justify-between bg-white md:hidden"
          >
            <span>FILTER</span>
            <SlidersHorizontal className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[78vw] max-w-xs overflow-y-auto bg-white p-0"
        >
          <SheetTitle className="sr-only">Filter restaurant</SheetTitle>
          <FilterSidebar mobile />
        </SheetContent>
      </Sheet>
    </>
  );
}
