"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeCart, formatRupiah, getRestaurantTotal } from "@/lib/cart-utils";
import { useCart, useClearCart } from "@/lib/query/useCart";
import { useCheckout } from "@/lib/query/useOrder";
import {
  checkoutSchema,
  type CheckoutSchema,
} from "@/lib/validations/checkout-schema";
import { useAuthStore } from "@/store/auth";
import CheckoutSuccessDialog, {
  type CheckoutSuccessSummary,
} from "@/features/order/CheckoutSuccessDialog";

const paymentMethods = [
  {
    value: "BNI Bank Negara Indonesia",
    name: "Bank Negara Indonesia",
    logo: "/images/BNI.png",
  },
  {
    value: "BRI Bank Rakyat Indonesia",
    name: "Bank Rakyat Indonesia",
    logo: "/images/BRI.png",
  },
  {
    value: "BCA Bank Central Asia",
    name: "Bank Central Asia",
    logo: "/images/BCA.png",
  },
  {
    value: "Mandiri Bank",
    name: "Mandiri",
    logo: "/images/MANDIRI.png",
  },
];

function getCheckoutErrorMessage(error: unknown) {
  if (!(error instanceof AxiosError)) {
    return "Checkout gagal. Coba lagi.";
  }

  const response = error.response?.data;

  if (
    typeof response === "object" &&
    response !== null &&
    "message" in response &&
    typeof response.message === "string"
  ) {
    return response.message;
  }

  return "Checkout gagal. Coba lagi.";
}

export default function CheckoutPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const cartQuery = useCart();
  const clearCart = useClearCart();
  const checkout = useCheckout();
  const [successSummary, setSuccessSummary] =
    useState<CheckoutSuccessSummary | null>(null);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      phone: user?.phone ?? "",
      paymentMethod: paymentMethods[0].value,
      notes: "",
    },
  });

  if (!token) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold">Login diperlukan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk dulu untuk checkout pesanan.
          </p>
          <Button asChild className="mt-4">
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (cartQuery.isLoading) {
    return (
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <div className="h-10 w-44 rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-[1fr_360px]">
          <div className="h-80 rounded-lg bg-muted" />
          <div className="h-80 rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  if (cartQuery.isError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Cart gagal dimuat. Coba refresh halaman.
        </div>
      </main>
    );
  }

  const restaurants = normalizeCart(cartQuery.data);
  const subtotal = restaurants.reduce(
    (total, restaurant) => total + getRestaurantTotal(restaurant.items),
    0,
  );
  const itemCount = restaurants.reduce(
    (total, restaurant) =>
      total + restaurant.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );
  const deliveryFee = restaurants.length > 0 ? 10000 : 0;
  const serviceFee = restaurants.length > 0 ? 1000 : 0;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  if (successSummary) {
    return (
      <main className="min-h-[65vh]">
        <CheckoutSuccessDialog
          summary={successSummary}
          onSeeOrders={() => router.push("/orders")}
        />
      </main>
    );
  }

  if (restaurants.length === 0 || itemCount === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">Cart masih kosong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tambahkan menu sebelum checkout.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Cari Restaurant</Link>
          </Button>
        </div>
      </main>
    );
  }

  const onSubmit = async (values: CheckoutSchema) => {
    const checkoutRestaurants = restaurants.map((restaurant) => ({
      restaurantId: Number(restaurant.id),
      items: restaurant.items.map((item) => ({
        menuId: Number(item.menuId),
        quantity: item.quantity,
      })),
    }));

    const hasInvalidId = checkoutRestaurants.some(
      (restaurant) =>
        !Number.isInteger(restaurant.restaurantId) ||
        restaurant.items.some((item) => !Number.isInteger(item.menuId)),
    );

    if (hasInvalidId) {
      toast.error("Data restaurant atau menu tidak valid. Muat ulang cart.");
      return;
    }

    try {
      await checkout.mutateAsync({
        restaurants: checkoutRestaurants,
        deliveryAddress: values.deliveryAddress,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      });

      setSuccessSummary({
        date: new Date(),
        paymentMethod:
          paymentMethods.find((method) => method.value === values.paymentMethod)
            ?.name ?? values.paymentMethod,
        itemCount,
        subtotal,
        deliveryFee,
        serviceFee,
        total: grandTotal,
      });
      clearCart.mutate();
    } catch (error) {
      toast.error(getCheckoutErrorMessage(error));
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="grid gap-5 md:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <section className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-red-600" />
                <h2 className="font-semibold">Delivery Address</h2>
              </div>
              <textarea
                className="min-h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Jl. Sudirman No. 25, Jakarta Pusat, 10220"
                aria-invalid={!!form.formState.errors.deliveryAddress}
                {...form.register("deliveryAddress")}
              />
              {form.formState.errors.deliveryAddress ? (
                <p className="mt-2 text-xs text-destructive">
                  {form.formState.errors.deliveryAddress.message}
                </p>
              ) : null}
              <Input
                className="mt-3"
                placeholder="Nomor HP"
                aria-invalid={!!form.formState.errors.phone}
                {...form.register("phone")}
              />
              {form.formState.errors.phone ? (
                <p className="mt-2 text-xs text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              ) : null}
              <textarea
                className="mt-3 min-h-20 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Catatan untuk pesanan (opsional)"
                aria-invalid={!!form.formState.errors.notes}
                {...form.register("notes")}
              />
              {form.formState.errors.notes ? (
                <p className="mt-2 text-xs text-destructive">
                  {form.formState.errors.notes.message}
                </p>
              ) : null}
            </section>

            {restaurants.map((restaurant) => (
              <section
                key={restaurant.id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-semibold">{restaurant.name}</h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/restaurant/${restaurant.id}`}>Add Item</Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  {restaurant.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
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
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.menu.name}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatRupiah(item.menu.price)}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="size-5 text-red-600" />
                <h2 className="font-semibold">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-white">
                        <Image
                          src={method.logo}
                          alt={`${method.name} logo`}
                          width={34}
                          height={22}
                          className="max-h-6 w-auto object-contain"
                        />
                      </span>
                      <span className="truncate">{method.name}</span>
                    </span>
                    <input
                      type="radio"
                      value={method.value}
                      className="size-4 accent-red-600"
                      {...form.register("paymentMethod")}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold">Payment Summary</h2>
              <SummaryRow label={`Price (${itemCount} item)`} value={subtotal} />
              <SummaryRow label="Delivery Fee" value={deliveryFee} />
              <SummaryRow label="Service Fee" value={serviceFee} />
              <div className="mt-3 border-t pt-3">
                <SummaryRow label="Total" value={grandTotal} strong />
              </div>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={checkout.isPending}
              >
                {checkout.isPending ? "Processing..." : "Buy"}
              </Button>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={strong ? "font-bold" : "font-medium"}>
        {formatRupiah(value)}
      </span>
    </div>
  );
}
