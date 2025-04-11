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
        className="hover:text-blue-500"
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
    accessorKey: "phone", // Muestra el número de teléfono del proveedor
    header: "Phone",
    cell: ({ row }) => <p>{row.original.phone || "No phone provided"}</p>,
  },
  {
    accessorKey: "country", // Muestra el país del proveedor
    header: "Country",
    cell: ({ row }) => <p>{row.original.country || "No country provided"}</p>,
  },
];