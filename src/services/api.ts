import axios from "axios";

import type { LoginTypes, Authresponse } from "../types/authTypes";
import type {
  CategoriesResponse,
  FullResponse,
  GetProductsParams,
  CreateProductInput,
  UpdateProductInput,
  SingleProductResponse,
  ProductTypes,
} from "../types/productsCategoryTypes";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const loginApi = async (data: LoginTypes): Promise<Authresponse> => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};

const getProducts = async (
  params?: GetProductsParams,
): Promise<FullResponse> => {
  const response = await api.get<FullResponse>("/products", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      ...params,
    },
  });
  return response.data;
};

const getProductById = async (id: string): Promise<ProductTypes> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data || response.data
}

const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>("/categories");
  return response.data;
};

const addProduct = async (
  newProduct: CreateProductInput,
): Promise<SingleProductResponse> => {
  const response = await api.post<SingleProductResponse>(
    "/products",
    newProduct,
  );
  return response.data;
};

const updateProduct = async ({
  id,
  ...updateData
}: UpdateProductInput): Promise<SingleProductResponse> => {
  const response = await api.patch<SingleProductResponse>(
    `/products/${id}`,
    updateData,
  );
  return response.data;
};

const deleteProduct = async (
  id: string,
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export default api;
export {
  loginApi,
  getProducts,
  getProductById,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
};
