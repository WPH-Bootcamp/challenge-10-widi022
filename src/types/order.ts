export interface CheckoutRestaurantItem {
  menuId: number;
  quantity: number;
}

export interface CheckoutRestaurant {
  restaurantId: number;
  items: CheckoutRestaurantItem[];
}

export interface CheckoutPayload {
  restaurants: CheckoutRestaurant[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderItem {
  id?: number;
  menuId?: number;
  menuName?: string;
  quantity: number;
  price?: number;
  image?: string;
  itemTotal?: number;
  menu?: {
    name?: string;
    image?: string;
    price?: number;
  };
}

export interface OrderRestaurant {
  restaurantId?: number;
  restaurant?: {
    id?: number;
    name?: string;
    image?: string;
    logo?: string;
  };
  items?: OrderItem[];
  subtotal?: number;
}

export interface Order {
  id: number;
  transactionId?: string;
  status?: string;
  total?: number;
  totalPrice?: number;
  pricing?: {
    subtotal?: number;
    serviceFee?: number;
    deliveryFee?: number;
    totalPrice?: number;
  };
  createdAt?: string;
  restaurants?: OrderRestaurant[];
  deliveryAddress?: string;
  paymentMethod?: string;
}

export interface OrderQueryParams {
  status?: string;
  page?: string;
  limit?: string;
}
