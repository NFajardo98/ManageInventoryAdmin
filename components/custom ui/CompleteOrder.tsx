"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface CompleteOrderProps {
  orderId: string;
}

const CompleteOrder: React.FC<CompleteOrderProps> = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const onComplete = async () => {
    try {
      setLoading(true);
  
      // Obtener los detalles del pedido
      const orderRes = await fetch(`/api/orders/${orderId}`, {
        method: "GET",
      });
  
      if (!orderRes.ok) {
        throw new Error("Failed to fetch order details");
      }
  
      const { orderDetails } = await orderRes.json();
      console.log("Order details:", orderDetails);
  
      // Validar el inventario asociado a los productos
      for (const product of orderDetails.products) {
        const inventoryItems = product.product.inventory;
        console.log(`Validating inventory for product: ${product.product.title}`, inventoryItems);
  
      }
  
      // Eliminar el pedido
      //const deleteRes = await fetch(`/api/orders/${orderId}`, {
      //  method: "DELETE",
      //});
  
      if (!deleteRes.ok) {
        throw new Error("Failed to delete order");
      }
  
      setLoading(false);
      toast.success("Order completed successfully!");
      window.location.reload(); // Recargar la página para reflejar los cambios
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong! Please try again.");
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600">Complete Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to complete this order? This action will validate the inventory and delete the order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-green-600 text-white" onClick={onComplete}>
            Complete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteOrder;