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

const EMPTY_ORDERS: OrderSummary[] = [];

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
        search: search.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
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

  const rawOrders = data?.data ?? EMPTY_ORDERS;
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiShoppingBag className="text-blue-600" />
            Orders Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Monitor, inspect and update customer purchase orders
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="w-full md:w-80">
          <Search
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by ID, customer..."
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <FiFilter className="text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "ALL");
              setPage(1);
            }}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-rose-500">
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
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-blue-600 font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800">
                          {order.user?.name || "N/A"}
                        </div>
                        <div className="text-2xs text-slate-400">
                          {order.user?.email || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {order.items?.length || order._count?.items || 0}{" "}
                        item(s)
                      </td>
                      <td className="py-4 px-6 font-mono tabular-nums font-semibold text-slate-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
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
                        <button
                          onClick={() => handleOpenDetail(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                        >
                          <FiEye />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100">
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
