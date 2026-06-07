import { api } from "./axios";
import type { Menu, Restaurant, Review } from "@/types/restaurant";

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null;
}

function toStringId(value: unknown) {
  return value === undefined || value === null ? "" : String(value);
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function toString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function firstString(values: unknown[]) {
  return values.find((value): value is string => typeof value === "string");
}

function mapMenu(menu: unknown): Menu {
  const item = isRecord(menu) ? menu : {};

  return {
    id: toStringId(item.id),
    name: toString(item.name) ?? toString(item.foodName) ?? "Menu",
    image: toString(item.image),
    price: toNumber(item.price) ?? 0,
    description: toString(item.description),
    type: toString(item.type),
  };
}

function mapReview(review: unknown): Review {
  const item = isRecord(review) ? review : {};
  const user = isRecord(item.user) ? item.user : undefined;

  return {
    id: toStringId(item.id),
    star: toNumber(item.star) ?? toNumber(item.rating) ?? 0,
    comment: toString(item.comment),
    createdAt: toString(item.createdAt),
    user: user
      ? {
          id: toStringId(user.id),
          name: toString(user.name),
          avatar: toString(user.avatar),
        }
      : undefined,
  };
}

function mapRestaurant(restaurant: unknown): Restaurant {
  const item = isRecord(restaurant) ? restaurant : {};
  const images = Array.isArray(item.images) ? item.images : [];
  const priceRange = isRecord(item.priceRange) ? item.priceRange : undefined;

  return {
    id: toStringId(item.id),
    name: toString(item.name) ?? "Restaurant",
    logo: toString(item.logo),
    image: firstString([item.image, item.logo, ...images]),
    images: images.filter((image): image is string => typeof image === "string"),
    rating: toNumber(item.rating) ?? toNumber(item.star) ?? toNumber(item.averageRating),
    address: toString(item.address) ?? toString(item.place),
    distance: toNumber(item.distance),
    category: toString(item.category),
    priceMin: toNumber(item.priceMin) ?? toNumber(priceRange?.min),
    priceMax: toNumber(item.priceMax) ?? toNumber(priceRange?.max),
    totalMenus: toNumber(item.totalMenus) ?? toNumber(item.menuCount),
    totalReviews: toNumber(item.totalReviews) ?? toNumber(item.reviewCount),
    menus: Array.isArray(item.menus) ? item.menus.map(mapMenu) : undefined,
    reviews: Array.isArray(item.reviews) ? item.reviews.map(mapReview) : undefined,
  };
}

function getRestaurantArray(data: unknown) {
  if (!isRecord(data)) return [];

  if (Array.isArray(data.data)) return data.data;

  if (isRecord(data.data)) {
    if (Array.isArray(data.data.restaurants)) return data.data.restaurants;
    if (Array.isArray(data.data.data)) return data.data.data;
  }

  if (Array.isArray(data.restaurants)) return data.restaurants;

  return [];
}

function normalizeRestaurantList(data: unknown) {
  return {
    data: getRestaurantArray(data).map(mapRestaurant),
  };
}

/**
 * Ambil semua restaurant
 */
export const getRestaurants = async (params?: Record<string, string>) => {
  const { data } = await api.get("/resto", {
    params,
  });

  return normalizeRestaurantList(data);
};

/**
 * Detail restaurant
 */
export const getRestaurant = async (id: string) => {
  const { data } = await api.get(`/resto/${id}`, {
    params: {
      limitMenu: 20,
      limitReview: 20,
    },
  });

  const restaurant = isRecord(data) && isRecord(data.data) ? data.data : data;

  return {
    data: mapRestaurant(restaurant),
  };
};

/**
 * Search restaurant
 */
export const searchRestaurant = async (query: string) => {
  const { data } = await api.get("/resto/search", {
    params: {
      q: query,
    },
  });

  return normalizeRestaurantList(data);
};

/**
 * Best seller
 */
export const getBestSeller = async () => {
  const { data } = await api.get("/resto/best-seller");

  return normalizeRestaurantList(data);
};

/**
 * Recommended
 */
export const getRecommended = async () => {
  const { data } = await api.get("/resto/recommended");

  return normalizeRestaurantList(data);
};
