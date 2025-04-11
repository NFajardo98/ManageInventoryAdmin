"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderItemType } from "@/lib/types/orderItem";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "_id",
    header: "Product ID",
    cell: ({ row }) => {
      return <span>{row.original._id}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => row.original.title || "Unknown product", // Muestra el título del producto
  },
  {
    accessorKey: "allergens",
    header: "Allergens",
    cell: ({ row }) => row.original.product?.allergens || "Unknown allergen",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => row.original.quantity || 0,
  },
];