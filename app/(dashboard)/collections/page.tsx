"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { CollectionType } from "@/lib/types/collection"; // Importar el tipo CollectionType

// Definir el tipo CollectionType
//type CollectionType = {
//  _id: string;
//  title: string;
//  order: number;
//  products?: any[];
//};

const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data: CollectionType[] = await res.json();

      // Ordenar las colecciones por el campo `order`
      const sortedCollections = data.sort((a, b) => a.order - b.order);

      setCollections(sortedCollections);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const handleMove = async (collectionId: string, direction: "up" | "down") => {
    try {
      const res = await fetch("/api/collections", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionId, direction }),
      });

      if (res.ok) {
        setCollections((prevCollections) => {
          const updatedCollections = [...prevCollections];
          const index = updatedCollections.findIndex((c) => c._id === collectionId);

          if (index !== -1) {
            const swapIndex = direction === "up" ? index - 1 : index + 1;
            if (swapIndex >= 0 && swapIndex < updatedCollections.length) {
              const temp = updatedCollections[index];
              updatedCollections[index] = updatedCollections[swapIndex];
              updatedCollections[swapIndex] = temp;

              const tempOrder = updatedCollections[index].order;
              updatedCollections[index].order = updatedCollections[swapIndex].order;
              updatedCollections[swapIndex].order = tempOrder;
            }
          }

          return updatedCollections;
        });
      } 
    } catch (err) {
      console.error(err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Collections</p>

        <Button
          className="bg-blue-1 text-white hidden sm:flex items-center"
          onClick={() => router.push("/collections/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>

        <Button
          className="bg-blue-1 text-white flex sm:hidden p-2 rounded-full"
          onClick={() => router.push("/collections/new")}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns(handleMove)} data={collections} searchKey="title" />
    </div>
  );
};

export default Collections;

