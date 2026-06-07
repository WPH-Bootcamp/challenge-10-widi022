"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageCheck, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReviewDialog from "@/features/review/ReviewDialog";
import { formatRupiah } from "@/lib/cart-utils";
import { useMyOrders } from "@/lib/query/useOrder";
import { useAuthStore } from "@/store/auth";
import type { Order } from "@/types/order";

type RecordValue = Record<string, unknown>;

function asRecord(value: unknown): RecordValue {
  return typeof value === "object" && value !== null ? (value as RecordValue) : {};
}

function unwrapOrders(response: unknown): Order[] {
  const record = asRecord(response);
  const data = record.data;
  const dataRecord = asRecord(data);
  const raw = dataRecord.orders ?? dataRecord.data ?? data ?? response;

  return Array.isArray(raw) ? (raw as Order[]) : [];
}

function getOrderTotal(order: Order) {
  return order.pricing?.totalPrice ?? order.total ?? order.totalPrice ?? 0;
}

export default function OrderHistory() {
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const token = useAuthStore((state) => state.token);
  const ordersQuery = useMyOrders({
    ...(status === "all" ? {} : { status }),
    page: "1",
    limit: "10",
  });

  if (!token) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold">Login diperlukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masuk dulu untuk melihat history pesanan.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    );
  }

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 rounded-lg bg-muted" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-40 rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Order history gagal dimuat.
      </div>
    );
  }

  const orders = unwrapOrders(ordersQuery.data);
  const filteredOrders = orders.filter((order) => {
    const text = [
      order.transactionId,
      ...((order.restaurants ?? []).map(
        (restaurant) => restaurant.restaurant?.name,
      )),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(keyword.trim().toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder="Search order"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium">Status</span>
          {[
            ["all", "All"],
            ["done", "Done"],
            ["preparing", "Preparing"],
            ["on_the_way", "On The Way"],
            ["delivered", "Delivered"],
            ["cancelled", "Cancelled"],
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={status === value ? "default" : "outline"}
              className={status === value ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={() => setStatus(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <PackageCheck className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">Belum ada pesanan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pesanan yang berhasil checkout akan muncul di sini.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Cari Restaurant</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const restaurants = order.restaurants ?? [];

  return (
    <article className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            #{order.transactionId ?? order.id}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("id-ID")
              : "Tanggal belum tersedia"}
          </p>
        </div>
        <span className="w-fit rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
          {order.status ?? "Process"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <div
              key={`${restaurant.restaurant?.id ?? restaurant.restaurantId}-${index}`}
              className="rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="relative size-8 overflow-hidden rounded-md bg-muted">
                  {restaurant.restaurant?.logo ? (
                    <Image
                      src={restaurant.restaurant.logo}
                      alt={restaurant.restaurant.name ?? "Restaurant"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <p className="font-medium">
                  {restaurant.restaurant?.name ?? "Restaurant"}
                </p>
              </div>
              <div className="mt-2 space-y-1 text-muted-foreground">
                {(restaurant.items ?? []).map((item, itemIndex) => (
                  <div
                    key={`${item.menuId}-${itemIndex}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>
                      {item.menuName ?? item.menu?.name ?? "Menu"} × {item.quantity}
                    </span>
                    <span>{formatRupiah(item.itemTotal ?? item.price ?? 0)}</span>
                  </div>
                ))}
              </div>
              {order.transactionId && restaurant.restaurant?.id ? (
                <div className="mt-3 flex justify-end">
                  <ReviewDialog
                    transactionId={order.transactionId}
                    restaurantId={restaurant.restaurant.id}
                    restaurantName={restaurant.restaurant.name ?? "Restaurant"}
                    menuIds={(restaurant.items ?? [])
                      .map((item) => item.menuId)
                      .filter((menuId): menuId is number => typeof menuId === "number")}
                  />
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Detail item belum tersedia.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-bold">{formatRupiah(getOrderTotal(order))}</p>
        </div>
      </div>
    </article>
  );
}
