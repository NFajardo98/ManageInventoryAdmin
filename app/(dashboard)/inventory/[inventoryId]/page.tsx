"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Loader from "@/components/custom ui/Loader";
import InventoryForm from "@/components/inventory/InventoryForm";
import { InventoryColumnType } from "@/lib/types/inventory";

const InventoryDetails = () => {
  const params = useParams(); // ✅ Usar useParams() para obtener inventoryId
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

  return loading ? <Loader /> : <InventoryForm initialData={inventoryDetails} />;
};

export default InventoryDetails;