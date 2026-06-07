import { Suspense } from "react";
import CategoryFilters from "@/features/category/CategoryFilters";
import CategoryRestaurantList from "@/features/category/CategoryRestaurantList";

export default function CategoryPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-8 md:py-10">
      <h1 className="mb-5 text-xl font-bold md:mb-7 md:text-2xl">
        All Restaurant
      </h1>

      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
        <div>
          <Suspense>
            <CategoryFilters />
          </Suspense>
        </div>

        <div>
          <Suspense>
            <CategoryRestaurantList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
