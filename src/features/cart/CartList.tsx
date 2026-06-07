"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCart,
  useClearCart,
  useDeleteCart,
  useUpdateCart,
} from "@/lib/query/useCart";
import {
  formatRupiah,
  getRestaurantTotal,
  normalizeCart,
} from "@/lib/cart-utils";
import { useAuthStore } from "@/store/auth";
import type { CartItem } from "@/types/cart";

export default function CartList() {
  const token = useAuthStore((state) => state.token);
  const cartQuery = useCart();
  const updateCart = useUpdateCart();
  const deleteCart = useDeleteCart();
  const clearCartMutation = useClearCart();

  if (!token) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold">Login diperlukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Masuk dulu untuk melihat isi cart kamu.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    );
  }

  if (cartQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-56 rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (cartQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Cart gagal dimuat. Coba refresh halaman.
      </div>
    );
  }

  const restaurants = normalizeCart(cartQuery.data);
  const totalItems = restaurants.reduce(
    (total, restaurant) =>
      total + restaurant.items.reduce((subtotal, item) => subtotal + item.quantity, 0),
    0,
  );

  if (restaurants.length === 0 || totalItems === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold">Cart masih kosong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pilih menu dari restaurant favorit kamu dulu.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Cari Restaurant</Link>
        </Button>
      </div>
    );
  }

  const handleQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCart.mutateAsync({ id: item.id, quantity });
      toast.success("Quantity cart diperbarui");
    } catch {
      toast.error("Gagal update quantity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCart.mutateAsync(id);
      toast.success("Item dihapus dari cart");
    } catch {
      toast.error("Gagal menghapus item");
    }
  };

  const handleClear = async () => {
    try {
      await clearCartMutation.mutateAsync();
      toast.success("Cart dikosongkan");
    } catch {
      toast.error("Gagal mengosongkan cart");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Cart</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={clearCartMutation.isPending}
        >
          Clear Cart
        </Button>
      </div>

      {restaurants.map((restaurant) => {
        const restaurantTotal = getRestaurantTotal(restaurant.items);

        return (
          <section
            key={restaurant.id}
            className="rounded-lg border bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              {restaurant.image ? (
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  width={24}
                  height={24}
                  className="rounded object-cover"
                />
              ) : null}
              <span>{restaurant.name}</span>
            </div>

            <div className="divide-y">
              {restaurant.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-3"
                >
                  <div className="relative size-16 overflow-hidden rounded-md bg-muted">
                    {item.menu.image ? (
                      <Image
                        src={item.menu.image}
                        alt={item.menu.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.menu.name}</p>
                    <p className="text-sm font-semibold">
                      {formatRupiah(item.menu.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() => handleQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateCart.isPending}
                      aria-label="Kurangi quantity"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <Button
                      type="button"
                      size="icon-xs"
                      onClick={() => handleQuantity(item, item.quantity + 1)}
                      disabled={updateCart.isPending}
                      aria-label="Tambah quantity"
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteCart.isPending}
                      aria-label="Hapus item"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold">{formatRupiah(restaurantTotal)}</p>
              </div>
              <Button asChild className="sm:w-44">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </section>
        );
      })}

      {(updateCart.isPending || deleteCart.isPending) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Sinkronisasi cart...
        </div>
      )}
    </div>
  );
}
