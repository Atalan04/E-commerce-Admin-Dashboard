 import type { OrderSummary } from "./ordersTypes"
 
 type UserRole = "ADMIN" | "CUSTOMER" | "USER";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetUsersResponse {
  success: boolean;
  data: UserItem[];
  meta: PaginationMeta;
}

interface UserDetail extends UserItem {
  orders?: OrderSummary[];
}

interface SingleUserResponse {
  success: boolean;
  data: UserDetail;
}

export type { UserItem, PaginationMeta, GetUsersParams, GetUsersResponse,SingleUserResponse };



