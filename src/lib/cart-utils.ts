import type { CartItem, CartMenu, CartRestaurant } from "@/types/cart";

type RecordValue = Record<string, unknown>;

function asRecord(value: unknown): RecordValue {
  return typeof value === "object" && value !== null ? (value as RecordValue) : {};
}

function asString(value: unknown): string;
function asString(value: unknown, fallback: undefined): string | undefined;
function asString(value: unknown, fallback: string): string;
function asString(value: unknown, fallback: string | undefined = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function unwrapData(value: unknown): unknown {
  const record = asRecord(value);
  const data = record.data;
  const cart = asRecord(data).cart;
  const nestedData = asRecord(data).data;

  return cart ?? nestedData ?? data ?? value;
}

export function normalizeCart(response: unknown): CartRestaurant[] {
  const raw = unwrapData(response);
  const groups = Array.isArray(raw) ? raw : [];

  return groups.map((group): CartRestaurant => {
    const groupRecord = asRecord(group);
    const restaurantRecord = asRecord(groupRecord.restaurant);
    const rawItems =
      groupRecord.items ??
      groupRecord.cartItems ??
      groupRecord.carts ??
      groupRecord.menuItems;
    const items = Array.isArray(rawItems) ? rawItems : [];

    const restaurantId = asString(
      groupRecord.restaurantId ?? restaurantRecord.id ?? groupRecord.id,
    );

    return {
      id: restaurantId,
      name: asString(restaurantRecord.name ?? groupRecord.restaurantName, "Restaurant"),
      image: asString(restaurantRecord.image ?? restaurantRecord.logo, undefined),
      items: items.map((item): CartItem => {
        const itemRecord = asRecord(item);
        const menuRecord = asRecord(itemRecord.menu);
        const menu: CartMenu = {
          id: asString(itemRecord.menuId ?? menuRecord.id),
          name: asString(
            menuRecord.name ?? menuRecord.foodName ?? itemRecord.menuName,
            "Food Name",
          ),
          image: asString(menuRecord.image ?? itemRecord.image, undefined),
          price: asNumber(menuRecord.price ?? itemRecord.price),
        };

        return {
          id: asString(itemRecord.id),
          restaurantId,
          menuId: menu.id,
          quantity: asNumber(itemRecord.quantity, 1),
          menu,
        };
      }),
    };
  });
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getRestaurantTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.menu.price * item.quantity, 0);
}
