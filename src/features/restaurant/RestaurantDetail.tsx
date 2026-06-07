"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ReviewCard from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/button";
import { formatRupiah, getRestaurantTotal, normalizeCart } from "@/lib/cart-utils";
import { useRestaurant } from "@/lib/query/useRestaurant";
import {
  useAddCart,
  useCart,
  useDeleteCart,
  useUpdateCart,
} from "@/lib/query/useCart";
import { useAuthStore } from "@/store/auth";
import type { CartItem } from "@/types/cart";
import type { Menu, Restaurant } from "@/types/restaurant";

type RestaurantDetailProps = {
  id: string;
};

type MenuFilter = "all" | "food" | "drink";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof AxiosError && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : fallback;
}

export default function RestaurantDetail({ id }: RestaurantDetailProps) {
  const [activeFilter, setActiveFilter] = useState<MenuFilter>("all");
  const restaurantQuery = useRestaurant(id);
  const cartQuery = useCart();

  if (restaurantQuery.isLoading) {
    return <DetailSkeleton />;
  }

  if (restaurantQuery.isError || !restaurantQuery.data?.data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Detail restaurant gagal dimuat.
        </div>
      </main>
    );
  }

  const restaurant = restaurantQuery.data.data;
  const menus = restaurant.menus ?? [];
  const reviews = restaurant.reviews ?? [];
  const filteredMenus =
    activeFilter === "all"
      ? menus
      : menus.filter((menu) => menu.type?.toLowerCase() === activeFilter);

  const restaurantCart = normalizeCart(cartQuery.data).find(
    (group) => group.id === restaurant.id,
  );
  const cartItems = restaurantCart?.items ?? [];
  const cartItemByMenuId = new Map(cartItems.map((item) => [item.menuId, item]));
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = getRestaurantTotal(cartItems);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <RestaurantGallery restaurant={restaurant} />
      <RestaurantHeader restaurant={restaurant} />

      <section className="space-y-4 border-t pt-6">
        <div>
          <h2 className="text-xl font-bold">Menu</h2>
          <div className="mt-3 flex gap-2">
            {(["all", "food", "drink"] as const).map((filter) => (
              <Button
                key={filter}
                type="button"
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                className={
                  activeFilter === filter ? "bg-red-600 hover:bg-red-700" : ""
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "all" ? "All Menu" : capitalize(filter)}
              </Button>
            ))}
          </div>
        </div>

        {cartItemCount > 0 ? (
          <CartSummary itemCount={cartItemCount} total={cartTotal} />
        ) : null}

        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                restaurantId={restaurant.id}
                cartItem={cartItemByMenuId.get(menu.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Menu {activeFilter === "all" ? "" : activeFilter} belum tersedia.
          </div>
        )}
      </section>

      <section className="space-y-4 border-t pt-6">
        <div>
          <h2 className="text-xl font-bold">Review</h2>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <strong>{restaurant.rating ?? 0}</strong>
            <span className="text-muted-foreground">
              ({restaurant.totalReviews ?? reviews.length} Ulasan)
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Belum ada review.
          </div>
        )}
      </section>
    </main>
  );
}

function RestaurantGallery({ restaurant }: { restaurant: Restaurant }) {
  const images = restaurant.images ?? (restaurant.image ? [restaurant.image] : []);

  return (
    <section className="grid gap-3 md:grid-cols-[1.35fr_1fr]">
      <GalleryImage
        src={images[0]}
        alt={restaurant.name}
        className="aspect-[16/10] md:h-full"
        priority
      />
      <div className="hidden grid-cols-2 gap-3 md:grid">
        <GalleryImage
          src={images[1] ?? images[0]}
          alt={restaurant.name}
          className="col-span-2 aspect-[16/7]"
        />
        <GalleryImage
          src={images[2] ?? images[0]}
          alt={restaurant.name}
          className="aspect-[4/3]"
        />
        <GalleryImage
          src={images[3] ?? images[0]}
          alt={restaurant.name}
          className="aspect-[4/3]"
        />
      </div>
    </section>
  );
}

function GalleryImage({
  src,
  alt,
  className,
  priority,
}: {
  src?: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : null}
    </div>
  );
}

function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
          {restaurant.logo ? (
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <strong>{restaurant.rating ?? 0}</strong>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {restaurant.address ?? "Alamat belum tersedia"}
            {restaurant.distance ? ` · ${restaurant.distance} km` : ""}
          </p>
        </div>
      </div>
      <Button type="button" variant="outline" size="sm">
        <Share2 className="size-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </section>
  );
}

function MenuCard({
  menu,
  restaurantId,
  cartItem,
}: {
  menu: Menu;
  restaurantId: string;
  cartItem?: CartItem;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const addCart = useAddCart();
  const updateCart = useUpdateCart();
  const deleteCart = useDeleteCart();
  const isPending = addCart.isPending || updateCart.isPending || deleteCart.isPending;

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Login dulu untuk menambahkan menu ke cart");
      router.push(`/login?redirect=/restaurant/${restaurantId}`);
      return;
    }

    try {
      await addCart.mutateAsync({
        restaurantId: Number(restaurantId),
        menuId: Number(menu.id),
        quantity: 1,
      });
      toast.success("Menu ditambahkan ke cart");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan menu ke cart"));
    }
  };

  const handleQuantity = async (quantity: number) => {
    if (!cartItem) return;

    try {
      if (quantity < 1) {
        await deleteCart.mutateAsync(cartItem.id);
      } else {
        await updateCart.mutateAsync({ id: cartItem.id, quantity });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui quantity"));
    }
  };

  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-muted">
        {menu.image ? (
          <Image
            src={menu.image}
            alt={menu.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="space-y-3 p-3">
        <div>
          <h3 className="truncate text-sm font-medium">{menu.name}</h3>
          <p className="text-sm font-semibold">{formatRupiah(menu.price)}</p>
        </div>

        {cartItem ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => handleQuantity(cartItem.quantity - 1)}
              disabled={isPending}
              aria-label="Kurangi quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-5 text-center text-sm">{cartItem.quantity}</span>
            <Button
              type="button"
              size="icon-xs"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleQuantity(cartItem.quantity + 1)}
              disabled={isPending}
              aria-label="Tambah quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>
        ) : (
          <Button
            className="ml-auto flex h-7 bg-red-600 px-5 text-xs hover:bg-red-700"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            Add
          </Button>
        )}
      </div>
    </article>
  );
}

function CartSummary({ itemCount, total }: { itemCount: number; total: number }) {
  return (
    <div className="sticky bottom-3 z-20 flex items-center justify-between gap-4 rounded-lg border bg-white p-3 shadow-lg">
      <div>
        <p className="flex items-center gap-2 text-xs font-medium">
          <ShoppingBag className="size-4" />
          {itemCount} items
        </p>
        <p className="mt-1 text-sm font-bold">{formatRupiah(total)}</p>
      </div>
      <Button asChild className="w-40 bg-red-600 hover:bg-red-700">
        <Link href="/checkout">Checkout</Link>
      </Button>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="h-72 rounded-lg bg-muted" />
      <div className="h-20 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-56 rounded-lg bg-muted" />
        ))}
      </div>
    </main>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
