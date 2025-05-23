"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import Loader from "@/components/custom ui/Loader";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";
import { OrderColumnType } from "@/lib/types/order"; // Importamos el tipo de pedido

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<OrderColumnType[]>([]); // Tipamos el estado
  const [completedOrders, setCompletedOrders] = useState<OrderColumnType[]>([]); // Tipamos el estado

  const getOrders = async () => {
    try {
      const res = await fetch(`/api/orders`);
      const data: OrderColumnType[] = await res.json(); // Tipamos la respuesta de la API
      console.log("Orders fetched:", data); // Verifica los datos devueltos

      // Dividir pedidos por estado
      setPendingOrders(data.filter((order: OrderColumnType) => order.status === "pending"));
      setCompletedOrders(data.filter((order: OrderColumnType) => order.status === "completed"));

      setLoading(false);
    } catch (err) {
      console.log("[orders_GET]", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Orders</p>
      <Separator className="bg-grey-1 my-5" />

      {/* Pedidos pendientes */}
      <p className="text-lg font-bold mb-4">Pending Orders</p>
      <DataTable columns={columns} data={pendingOrders} searchKey="createdAt" />

      <Separator className="bg-grey-1 my-5" />

      {/* Pedidos completados */}
      <p className="text-lg font-bold mb-4">Completed Orders</p>
      <DataTable
        columns={columns.map((col) =>
          col.id === "_id"
            ? { ...col, cell: () => <span>Completed</span> }
            : col
        )}
        data={completedOrders}
        searchKey="createdAt"
      />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Orders;