"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

interface AcceptOrderButtonProps {
  orderId: string;
  disabled?: boolean; 
}

const AcceptOrderButton: React.FC<AcceptOrderButtonProps> = ({ orderId, disabled }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptOrder = async () => {
    if (disabled) return; // Evitar acción si el botón está deshabilitado
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", // Cambiamos a PATCH para actualizar el estado
      });

      if (response.ok) {
        toast.success("Order marked as completed!");
        router.push("/orders"); // Redirige a la página de Orders
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to mark order as completed");
      }
    } catch (err) {
      console.error("[handleAcceptOrder]", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAcceptOrder}
      disabled={isLoading}
      className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? "Processing..." : "Mark as Completed"}
    </button>
  );
};

export default AcceptOrderButton;