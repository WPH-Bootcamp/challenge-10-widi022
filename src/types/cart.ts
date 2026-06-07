export interface CartMenu {
  id: string;
  name: string;
  image?: string;
  price: number;
}

export interface CartItem {
  id: string;
  restaurantId: string;
  menuId: string;
  quantity: number;
  menu: CartMenu;
}

export interface CartRestaurant {
  id: string;
  name: string;
  image?: string;
  items: CartItem[];
}

export interface AddCartPayload {
  restaurantId: number;
  menuId: number;
  quantity: number;
}

export interface UpdateCartPayload {
  id: string;
  quantity: number;
}
