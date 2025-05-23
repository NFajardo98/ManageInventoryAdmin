"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { OrderColumnType } from "@/lib/types/order";
import Delete from "../custom ui/Delete";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "table",
    header: "Table",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original._id}`}
        className="block hover:text-red-500"
      >
        {row.original.table}
      </Link>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original._id}`}
        className="block hover:text-red-500"
      >
        {row.original.products}
      </Link>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original._id}`}
        className="block hover:text-red-500"
      >
        ${row.original.totalAmount}
      </Link>
    ),
  },
{
  accessorKey: "createdAt",
  header: "Created At",
  cell: ({ row }) => {
    return (
      <Link
        href={`/orders/${row.original._id}`}
        className="block hover:text-red-500"
      >
        {row.original.createdAt.toString()}
      </Link>
    );
  },
},
  {
    id: "actions",
    cell: ({ row }) => <Delete item="order" id={row.original._id} />,
  },
];