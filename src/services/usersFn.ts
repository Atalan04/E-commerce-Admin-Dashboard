import type {
  GetUsersParams,
  GetUsersResponse,
  SingleUserResponse,
} from "../types/usersTypes";
import api from "./api";

const getUsers = async (params?: GetUsersParams): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>("/users", { params });
  return response.data;
};

const getUserById = async (id: string): Promise<SingleUserResponse> => {
  const response = await api.get<SingleUserResponse>(`/users/${id}`);
  return response.data;
};

const deleteUser = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
export { getUsers, getUserById, deleteUser };
