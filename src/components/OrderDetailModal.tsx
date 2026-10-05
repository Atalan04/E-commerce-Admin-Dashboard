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
  PROCESSING: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
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
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <div>
            <div>
              <h2>Order Details</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColorMap[order.status]?.bg} ${statusColorMap[order.status]?.text} ${statusColorMap[order.status]?.border}`}
              >
                {order.status}
              </span>
            </div>
            <p>ID: {order.id}</p>
          </div>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div>
          <div>
            <div>
              <FiUser /> Customer Info
            </div>
            <p>{order.user?.name || "Guest / Unassigned"}</p>
            <p>{order.user?.email || "No email available"}</p>
          </div>

          <div>
            <div>
              <FiCalendar /> Timestamp
            </div>
            <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
            {order.updatedAt && (
              <p>
                Last updated: {new Date(order.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3>
            <FiPackage /> Purchased Items ({order.items?.length || 0})
          </h3>
          <div>
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id}>
                  <div>
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                      />
                    )}
                    <div>
                      <p>{item.product?.title || "Item"}</p>
                      <div>
                        <span>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                        {item.product?.category?.name && (
                          <span>
                            <FiTag />
                            {item.product.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No item breakdown available.</p>
            )}
          </div>
        </div>

        <div>
          <div>
            <label>Change Status:</label>
            <select
              value={order.status}
              disabled={isUpdating}
              onChange={(e) =>
                onStatusChange(order.id, e.target.value as OrderStatus)
              }
            >
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span>Total Price:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
