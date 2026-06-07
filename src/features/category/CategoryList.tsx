"use client";

import Image from "next/image";
import CategoryCard from "@/components/shared/CategoryCard";

const categories = [
  {
    label: "All Restaurant",
    href: "/category",
    icon: "/images/All-restaurant.png",
  },
  {
    label: "Nearby",
    href: "/category?range=1",
    icon: "/images/Nearby.png",
  },
  {
    label: "Discount",
    href: "/category?category=discount",
    icon: "/images/Discount.png",
  },
  {
    label: "Best Seller",
    href: "/category?rating=5",
    icon: "/images/Best-seller.png",
  },
  {
    label: "Delivery",
    href: "/category?category=delivery",
    icon: "/images/Delivery.png",
  },
  {
    label: "Lunch",
    href: "/category?category=lunch",
    icon: "/images/Lunch.png",
  },
];

export default function CategoryList() {
  return (
    <section className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.label}
          href={category.href}
          icon={
            <Image
              src={category.icon}
              alt=""
              width={52}
              height={52}
              className="size-11 object-contain sm:size-12"
            />
          }
          label={category.label}
        />
      ))}
    </section>
  );
}
