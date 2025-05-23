"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SupplierType } from "@/lib/types/supplier";

export const columns: ColumnDef<SupplierType, unknown>[] = [
  {
    accessorKey: "title", // Muestra el título del proveedor
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/suppliers/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "email", // Muestra el correo electrónico del proveedor
    header: "Email",
    cell: ({ row }) => <p>{row.original.email || "No email provided"}</p>,
  },
  {
    accessorKey: "address", // Muestra el número de teléfono del proveedor
    header: "Address",
    cell: ({ row }) => <p>{row.original.address || "No address provided"}</p>,
  },
  {
    accessorKey: "city", // Muestra el país del proveedor
    header: "City",
    cell: ({ row }) => <p>{row.original.city || "No city provided"}</p>,
  },
    {
    accessorKey: "country", // Muestra el país del proveedor
    header: "Country",
    cell: ({ row }) => <p>{row.original.country || "No country provided"}</p>,
  },
];