"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderItemType } from "@/lib/types/orderItem";

export const columns: ColumnDef<OrderItemType>[] = [

  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => row.original.title || "Unknown product", // Muestra el título del producto
  },
  {
    accessorKey: "allergens",
    header: "Allergens",
    cell: ({ row }) => {
      // Accede directamente a los allergens
      const allergens = row.original.allergens;
      return allergens && allergens.length > 0
        ? allergens.join(", ") // Muestra los allergens como una lista separada por comas
        : "No allergens";
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => row.original.quantity || 0,
  },
];