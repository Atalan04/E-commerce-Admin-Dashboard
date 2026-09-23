import axios from "axios";
import type { LoginTypes, Authresponse } from "../types/authTypes";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const loginApi = async (data: LoginTypes): Promise<Authresponse> => {
  const response = await api.post("/auth/login",data);
  return response.data.data;
};

export default api;
export {loginApi}