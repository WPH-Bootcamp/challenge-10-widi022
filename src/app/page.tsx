import { Suspense } from "react";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import CategoryList from "@/features/category/CategoryList";
import RestaurantList from "@/features/restaurant/RestauranList";

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense>
        <Hero />
      </Suspense>
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        <CategoryList />
        <Suspense>
          <RestaurantList showSearch={false} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
