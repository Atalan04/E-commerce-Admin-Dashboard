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

export default function UsersManagement() {
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
    },
    onError: (err) => {
      console.error("Failed to delete user:", err);
    },
  });

  return (
    <div>
      <div>
        <div>
          <h1>Users Management</h1>
          <p>Manage all registered accounts, orders, and roles</p>
        </div>

        <Search
          onSearch={handleSearchChange}
          placeholder="Search by name or email..."
        />
      </div>

      <div>
        {isLoading ? (
          <div>Loading users...</div>
        ) : isError ? (
          <div>Failed to load users.</div>
        ) : users.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div>{user.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div>{user.name}</div>
                          <div>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
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
                    <td>
                      <span>
                        <FiShoppingBag />
                        {user._count?.orders ?? 0}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div>
                        <button onClick={() => setSelectedUserId(user.id)}>
                          <FiEye />
                        </button>
                        <button onClick={() => setUserToDelete(user)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
      </div>

      {selectedUserId && (
        <div>
          <div>
            <div>
              <h3>User Profile & Orders</h3>
              <button onClick={() => setSelectedUserId(null)}>
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isDetailLoading ? (
                <div>Loading user info...</div>
              ) : userDetailRes?.data ? (
                <>
                  <div>
                    <div>{userDetailRes.data.name.charAt(0)}</div>
                    <div>
                      <h4>{userDetailRes.data.name}</h4>
                      <p>{userDetailRes.data.email}</p>
                      <div>
                        <span>
                          <FiUser /> {userDetailRes.data.role}
                        </span>
                        <span>
                          <FiCalendar />{" "}
                          {new Date(
                            userDetailRes.data.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5>Order History</h5>
                    {userDetailRes.data.orders &&
                    userDetailRes.data.orders.length > 0 ? (
                      <div>
                        {userDetailRes.data.orders.map((order) => (
                          <div key={order.id}>
                            <div>
                              <span>Order #{order.id}</span>
                              <div>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <div>${order.totalAmount.toLocaleString()}</div>
                              <span>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No previous orders found for this user.</p>
                    )}
                  </div>
                </>
              ) : (
                <div>Failed to load details.</div>
              )}
            </div>

            <div>
              <button type="button" onClick={() => setSelectedUserId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div>
          <div>
            <div>
              <FiTrash2 />
            </div>
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <span>{userToDelete.name}</span>?
              This action cannot be undone.
            </p>

            <div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(userToDelete.id)}
                disabled={deleteMutation.isPending}
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
