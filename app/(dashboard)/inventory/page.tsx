"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/inventory/InventoryColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { InventoryColumnType } from "@/lib/types/inventory";

const Inventory = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryColumnType[]>([]);

  const getInventory = async () => {
    try {
      const res = await fetch("/api/inventory", {
        method: "GET",
      });
      const data: InventoryColumnType[] = await res.json();

      setInventory(data);
      setLoading(false);
    } catch (err) {
      console.log("[inventory_GET]", err);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    console.log("Inventory data:", inventory);
  }, [inventory]);
  
  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Inventory</p>

        <Button
          className="bg-blue-1 text-white hidden sm:flex items-center"
          onClick={() => router.push("/inventory/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>

        <Button
          className="bg-blue-1 text-white flex sm:hidden p-2 rounded-full"
          onClick={() => router.push("/inventory/new")}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={inventory} searchKey="name" />
    </div>
  );
};

export default Inventory;