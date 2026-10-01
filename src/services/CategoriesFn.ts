import api from "./api";

import type { CategoriesResponse } from "../types/productsCategoryTypes";

const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>("/categories");
  return response.data;
};

const createCategory = async (payload: { name: string }) => {
  const response = await api.post("/categories", payload);
  return response.data;
};

const updateCategory = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const response = await api.patch(`/categories/${id}`, { name });
  return response.data;
};

const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export {
  getCategories,createCategory,updateCategory,deleteCategory
}