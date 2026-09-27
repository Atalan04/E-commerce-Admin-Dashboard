import axios from "axios";

import type { LoginTypes, Authresponse } from "../types/authTypes";
import type { CategoriesResponse, FullResponse, GetProductsParams } from "../types/productsCategoryTypes";


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const loginApi = async (data: LoginTypes): Promise<Authresponse> => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};

const getProducts = async(params?:GetProductsParams): Promise<FullResponse> =>{
  const response = await api.get<FullResponse>("/products",{
    params: {
      page:params?.page??1,
      limit: params?.limit??10,
      search: params?. search,
      ...params,
    }
  })
  return response.data
} 

const getCategories = async(): Promise<CategoriesResponse> =>{
const response = await api.get<CategoriesResponse>("/categories")
return response.data
}

export default api;
export { loginApi,getProducts,getCategories };
