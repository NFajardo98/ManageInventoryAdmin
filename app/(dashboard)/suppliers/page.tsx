"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/suppliers/SupplierColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Suppliers = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  const getSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "GET",
      });
      const data = await res.json();
      setSuppliers(data);
      setLoading(false);
    } catch (err) {
      console.log("[suppliers_GET]", err);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Suppliers</p>
        <Button className="bg-blue-1 text-white" onClick={() => router.push("/suppliers/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Supplier
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={suppliers} searchKey="title" />
      
    </div>
  );
};

export default Suppliers;
