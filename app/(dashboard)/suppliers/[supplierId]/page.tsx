"use client";

import { useEffect, useState } from "react";
import { use } from "react";

import Loader from "@/components/custom ui/Loader";
import SupplierForm from "@/components/suppliers/SupplierForm";
import { SupplierType } from "@/lib/types/supplier";

const SupplierDetails = ({ params }: { params: Promise<{ supplierId: string }> }) => {
  const { supplierId } = use(params); // Desenvuelve `params` usando `use()`

  const [loading, setLoading] = useState(true);
  const [supplierDetails, setSupplierDetails] = useState<SupplierType | null>(null);

  const getSupplierDetails = async () => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "GET",
      });
      const data = await res.json();
      setSupplierDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[supplierId_GET]", err);
    }
  };

  useEffect(() => {
    getSupplierDetails();
  }, []);

  return loading ? <Loader /> : <SupplierForm initialData={supplierDetails} />;
};

export default SupplierDetails;