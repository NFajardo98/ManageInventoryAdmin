"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Importa useRouter para manejar la navegación
import Loader from "@/components/custom ui/Loader";
import InventoryForm from "@/components/inventory/InventoryForm";
import { InventoryColumnType } from "@/lib/types/inventory";
import { Button } from "@/components/ui/button"; // Importa el componente Button

const InventoryDetails = () => {
  const params = useParams(); // ✅ Usar useParams() para obtener inventoryId
  const router = useRouter(); // ✅ Usar useRouter para manejar la navegación
  const [loading, setLoading] = useState(true);
  const [inventoryDetails, setInventoryDetails] = useState<InventoryColumnType | null>(null);

  const getInventoryDetails = async () => {
    if (!params.inventoryId) return; // ✅ Verifica que params.inventoryId existe
    try {
      const res = await fetch(`/api/inventory/${params.inventoryId}`, {
        method: "GET",
      });
      const data = await res.json();
      setInventoryDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[inventoryId_GET]", err);
    }
  };

  useEffect(() => {
    getInventoryDetails();
  }, [params.inventoryId]); // ✅ Se ejecuta cuando cambia inventoryId

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Inventory Details</p>
        <div className="flex gap-4">
          <Button
            className="bg-blue-1 text-white"
            onClick={() => router.push("/notifications")}
          >
            Check Threshold
          </Button>
        </div>
      </div>
      <InventoryForm initialData={inventoryDetails} />
    </div>
  );
};

export default InventoryDetails;