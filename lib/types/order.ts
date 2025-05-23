export type OrderColumnType = {
  _id: string;
  location: string;
  products: number;
  totalAmount: number;
  createdAt: string;
  status: "pending" | "completed"; // Nuevo campo
  table: number; // Nuevo campo
};