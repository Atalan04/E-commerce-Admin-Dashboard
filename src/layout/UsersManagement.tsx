import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiEye,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

import Search from "../components/templates/Search";
import Pagination from "../components/templates/Pagination";
import { getUsers, getUserById, deleteUser } from "../services/usersFn";
import type { UserItem } from "../types/usersTypes";

function UsersManagement() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const {
    data: usersRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", { page, search }],
    queryFn: () => getUsers({ page, limit: 10, search }),
  });

  const users = usersRes?.data ?? [];
  const meta = usersRes?.meta;

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const { data: userDetailRes, isLoading: isDetailLoading } = useQuery({
    queryKey: ["user-detail", selectedUserId],
    queryFn: () => getUserById(selectedUserId!),
    enabled: !!selectedUserId,
  });
  

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      setUserToDelete(null);
    },
    onError: (err) => {
      console.error("Failed to delete user:", err);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Users Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Manage all registered accounts, orders, and roles
          </p>
        </div>

        <div className="w-full md:w-72">
          <Search
            onSearch={handleSearchChange}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Loading users...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-sm">
            Failed to load users.
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 md:px-6">User</th>
                  <th className="py-3.5 px-4 md:px-6">Role</th>
                  <th className="py-3.5 px-4 md:px-6">Orders</th>
                  <th className="py-3.5 px-4 md:px-6">Joined Date</th>
                  <th className="py-3.5 px-4 md:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 md:px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 md:px-6">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                        <FiShoppingBag className="text-slate-400" />
                        {user._count?.orders ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 md:px-6 text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 md:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUserId(user.id)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View user"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete user"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-100">
          <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
        </div>
      </div>

      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">
                User Profile & Orders
              </h3>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
              {isDetailLoading ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  Loading user info...
                </div>
              ) : userDetailRes?.data ? (
                <>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                      {userDetailRes.data.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {userDetailRes.data.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {userDetailRes.data.email}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiUser /> {userDetailRes.data.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar />{" "}
                          {new Date(
                            userDetailRes.data.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">
                      Order History
                    </h5>
                    {userDetailRes.data.orders &&
                    userDetailRes.data.orders.length > 0 ? (
                      <div className="space-y-2">
                        {userDetailRes.data.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition"
                          >
                            <div>
                              <span className="font-mono text-xs font-semibold text-blue-600">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <div className="text-2xs text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono tabular-nums font-semibold text-slate-800 text-sm">
                                ${order.totalAmount.toLocaleString()}
                              </div>
                              <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No previous orders found for this user.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-rose-500 text-sm">
                  Failed to load details.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserId(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl">
              <FiTrash2 />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Delete User
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete
                <span className="font-semibold text-slate-800">
                  {userToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(userToDelete.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
