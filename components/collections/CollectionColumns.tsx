"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { CollectionType } from "@/lib/types/collection";
import { ArrowUp, ArrowDown } from "lucide-react"; // Importar íconos estilizados

export const columns = (
  handleMove: (collectionId: string, direction: "up" | "down") => void
): ColumnDef<CollectionType, unknown>[] => [
  {
    accessorKey: "title", // Usamos `accessorKey` para acceder directamente a la propiedad `title`
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/collections/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "products", // Usamos `accessorKey` para acceder directamente a la propiedad `products`
    header: "Products",
    cell: ({ row }) => <p>{row.original.products?.length || 0}</p>,
  },
  {
    id: "actions", // No usamos `accessorKey` aquí porque no es un campo de datos
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* Botón para mover hacia arriba */}
        <button
          onClick={() => handleMove(row.original._id, "up")}
          className="p-2 rounded-full bg-blue-1 text-white transition transform hover:-translate-y-1"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        {/* Botón para mover hacia abajo */}
        <button
          onClick={() => handleMove(row.original._id, "down")}
          className="p-2 rounded-full bg-blue-1 text-white transition transform hover:translate-y-1"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        {/* Botón para eliminar */}
        <Delete item="collection" id={row.original._id} />
      </div>
    ),
  },
];