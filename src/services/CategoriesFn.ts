import api from "./api";

import type { CategoriesResponse } from "../types/productsCategoryTypes";

const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>("/categories");
  return response.data;
};

const createCategory = async (payload: { name: string; icon?: string }) => {
  const response = await api.post("/categories", payload);
  return response.data;
};

const updateCategory = async ({
  id,
  name,
  icon,
}: {
  id: string;
  name: string;
  icon?: string;
}) => {
  const response = await api.put(`/categories/${id}`, { name, icon });
  return response.data;
};

const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export {
  getCategories,createCategory,updateCategory,deleteCategory
}