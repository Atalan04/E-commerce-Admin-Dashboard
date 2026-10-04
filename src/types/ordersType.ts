interface OrderSummary {
  id: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

export type {OrderSummary}