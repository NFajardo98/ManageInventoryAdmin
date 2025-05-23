"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryColumnType } from "@/lib/types/inventory";
import Link from "next/link";

export const columns: ColumnDef<InventoryColumnType, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/inventory/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "stock", // Muestra la cantidad disponible
    header: "Stock",
    cell: ({ row }) => <p>{row.original.stock}</p>,
  },
  {
    accessorKey: "unit", // Muestra la unidad de medida
    header: "Unit",
    cell: ({ row }) => <p>{row.original.unit}</p>,
  },
  {
    accessorKey: "unitPrice", // Muestra la unidad de medida
    header: "Price per Unit",
    cell: ({ row }) => <p>{row.original.unitPrice}</p>,
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