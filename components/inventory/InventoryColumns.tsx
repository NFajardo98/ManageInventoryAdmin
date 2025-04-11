"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryColumnType } from "@/lib/types/inventory";

export const columns: ColumnDef<InventoryColumnType, unknown>[] = [
  {
    accessorKey: "name", // Muestra el nombre del alimento
    header: "Name",
    cell: ({ row }) => <p>{row.original.title}</p>,
  },
  {
    accessorKey: "quantity", // Muestra la cantidad disponible
    header: "Quantity",
    cell: ({ row }) => <p>{row.original.quantity}</p>,
  },
  {
    accessorKey: "unit", // Muestra la unidad de medida
    header: "Unit",
    cell: ({ row }) => <p>{row.original.unit}</p>,
  },
  {
    accessorKey: "supplier", // Muestra el proveedor asociado
    header: "Supplier",
    cell: ({ row }) => (
      <p>
        {row.original.supplier
          ?.map((supplier) => supplier.title)
          .join(", ") || "Unknown Supplier"}
      </p>
    ),
  },
  {
    accessorKey: "createdAt", // Muestra la fecha de creación
    header: "Created At",
    cell: ({ row }) => <p>{new Date(row.original.createdAt).toLocaleDateString()}</p>,
  },
];