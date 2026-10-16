import React from "react";
import { FiX, FiPackage, FiUser, FiCalendar, FiTag } from "react-icons/fi";
import type { OrderStatus, OrderSummary } from "../types/ordersTypes";

interface OrderDetailModalProps {
  order: OrderSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  isUpdating?: boolean;
}

const statusColorMap: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  PENDING: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  PAID: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
 
  SHIPPED: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  DELIVERED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  CANCELLED: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating = false,
}) => {
  if (!isOpen || !order) return null;

  const allStatuses: OrderStatus[] = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">
                Order Details
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColorMap[order.status]?.bg} ${statusColorMap[order.status]?.text} ${statusColorMap[order.status]?.border}`}
              >
                {order.status}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400 mt-0.5">
              ID: {order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-600 flex items-center gap-1.5">
                <FiUser /> Customer Info
              </div>
              <p className="font-medium text-slate-900">
                {order.user?.name || "Guest / Unassigned"}
              </p>
              <p className="text-slate-500">
                {order.user?.email || "No email available"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-slate-600 flex items-center gap-1.5">
                <FiCalendar /> Timestamp
              </div>
              <p className="text-slate-700">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </p>
              {order.updatedAt && (
                <p className="text-slate-400">
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
              <FiPackage /> Purchased Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-2">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">
                          {item.product?.title || "Item"}
                        </p>
                        <div className="flex items-center gap-2 text-2xs text-slate-500">
                          <span>
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </span>
                          {item.product?.category?.name && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <FiTag />
                              {item.product.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-xs text-slate-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No item breakdown available.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-600">
              Change Status:
            </label>
            <select
              value={order.status}
              disabled={isUpdating}
              onChange={(e) =>
                onStatusChange(order.id, e.target.value as OrderStatus)
              }
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            >
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500">Total Price:</span>
            <span className="font-mono tabular-nums text-lg font-bold text-slate-900">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
