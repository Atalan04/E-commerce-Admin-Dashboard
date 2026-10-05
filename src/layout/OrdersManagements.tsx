import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiFilter, FiRefreshCw, FiShoppingBag } from "react-icons/fi";
import { getOrders, updateOrderStatus } from "../services/orderFn";
import { Pagination } from "../components/templates/Pagination";
import { Search } from "../components/templates/Search";
import { OrderDetailModal } from "../components/OrderDetailModal";
import type { OrderStatus, OrderSummary } from "../types/ordersTypes";
import type { PaginationMeta } from "../types/usersTypes";

const statusColorMap: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  PENDING: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  PAID: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  PROCESSING: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
  SHIPPED: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  DELIVERED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};

function OrdersManagement() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["orders", { page, limit, search, statusFilter }],
    queryFn: () =>
      getOrders({
        page,
        limit,
        search,
        status: statusFilter,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (selectedOrder && selectedOrder.id === res.data.id) {
        setSelectedOrder(res.data);
      }
    },
  });

  const handleOpenDetail = (order: OrderSummary) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const rawOrders = data?.data || [];
  const hasServerMeta = Boolean(data?.meta);

  const paginationMeta: PaginationMeta = useMemo(() => {
    if (data?.meta) {
      return data.meta;
    }
    const totalCount = rawOrders.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return {
      page,
      limit,
      total: totalCount,
      totalItems: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    } as PaginationMeta;
  }, [data?.meta, rawOrders.length, page, limit]);

  const displayedOrders = useMemo(() => {
    if (hasServerMeta) {
      return rawOrders;
    }
    const startIndex = (page - 1) * limit;
    return rawOrders.slice(startIndex, startIndex + limit);
  }, [hasServerMeta, rawOrders, page, limit]);

  return (
    <div>
      <div>
        <div>
          <h1>
            <FiShoppingBag />
            Orders Management
          </h1>
          <p>Monitor, inspect and update customer purchase orders</p>
        </div>

        <button onClick={() => refetch()}>
          <FiRefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          Refresh
        </button>
      </div>
      <div>
        <div>
          <Search
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by ID, customer..."
          />
        </div>

        <div>
          <FiFilter />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "ALL");
              setPage(1);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div>
                      <div></div>
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7}>
                    Failed to load orders:{" "}
                    {(error as Error)?.message || "Unknown error"}
                  </td>
                </tr>
              ) : displayedOrders.length > 0 ? (
                displayedOrders.map((order) => {
                  const statusInfo = statusColorMap[order.status] || {
                    bg: "bg-gray-100",
                    text: "text-gray-600",
                    dot: "bg-gray-400",
                  };

                  return (
                    <tr key={order.id}>
                      <td>#{order.id.slice(0, 8)}...</td>
                      <td>
                        <div>{order.user?.name || "N/A"}</div>
                        <div>{order.user?.email || "-"}</div>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        {order.items?.length || order._count?.items || 0}{" "}
                        item(s)
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                          ></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleOpenDetail(order)}>
                          <FiEye />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>No orders found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <Pagination
            meta={paginationMeta}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
}

export default OrdersManagement;
