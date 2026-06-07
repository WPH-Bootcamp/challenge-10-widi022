export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  images?: string[];
  rating?: number;
  address?: string;
  distance?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  totalMenus?: number;
  totalReviews?: number;
  menus?: Menu[];
  reviews?: Review[];
}

export interface Menu {
  id: string;
  name: string;
  image?: string;
  price: number;
  description?: string;
  type?: string;
}

export interface Review {
  id: string;
  star: number;
  comment?: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
}

export interface RestaurantResponse {
  data: Restaurant[];
  total: number;
}
