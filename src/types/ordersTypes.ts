import type { PaginationMeta } from "../types/usersTypes";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

 interface OrderCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  _count?: {
    products: number;
  };
}

 interface OrderProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  category?: OrderCategory;
  createdAt: string;
  updatedAt: string;
}

 interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: OrderProduct;
}

 interface OrderUser {
  id: string;
  name: string;
  email: string;
}

 interface OrderSummary {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  user: OrderUser;
  items: OrderItem[];
  _count?: {
    items: number;
  };
}

 interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

 interface GetOrdersResponse {
  success: boolean;
  data: OrderSummary[];
  meta: PaginationMeta;
}

 interface SingleOrderResponse {
  success: boolean;
  data: OrderSummary;
  message?: string;
}

 interface UpdateOrderStatusParams {
  id: string;
  status: OrderStatus;
}
 
export type {OrderCategory,OrderProduct, OrderItem, OrderUser, OrderSummary, GetOrdersParams, GetOrdersResponse, SingleOrderResponse, UpdateOrderStatusParams}