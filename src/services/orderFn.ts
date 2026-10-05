import type {
  GetOrdersParams,
  GetOrdersResponse,
  SingleOrderResponse,
  UpdateOrderStatusParams,
} from "../types/ordersTypes";
import api from "./api";

const getOrders = async (
  params?: GetOrdersParams,
): Promise<GetOrdersResponse> => {
  const response = await api.get<GetOrdersResponse>("/orders", { params });
  return response.data;
};

const getOrderById = async (id: string): Promise<SingleOrderResponse> => {
  const response = await api.get<SingleOrderResponse>(`/orders/${id}`);
  return response.data;
};

const updateOrderStatus = async ({
  id,
  status,
}: UpdateOrderStatusParams): Promise<SingleOrderResponse> => {
  const response = await api.patch<SingleOrderResponse>(`/orders/${id}/status`, {
    status,
  });
  return response.data;
};


export { getOrders, getOrderById, updateOrderStatus };
