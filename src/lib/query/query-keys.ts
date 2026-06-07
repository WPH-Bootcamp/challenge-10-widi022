export const QUERY_KEYS = {
  RESTAURANTS: ["restaurants"],
  RESTAURANT_SEARCH: (query: string) => ["restaurants", "search", query],
  BEST_SELLER: ["restaurants", "best-seller"],
  RECOMMENDED: ["restaurants", "recommended"],
  RESTAURANT: (id: string) => ["restaurant", id],
  CART: ["cart"],
  ORDERS: ["orders"],
  PROFILE: ["profile"],
};
