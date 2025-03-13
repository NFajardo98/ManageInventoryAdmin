"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Loader from "@/components/custom ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetails = () => {
  const params = useParams(); // ✅ Usar useParams() para obtener collectionId
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);

  const getCollectionDetails = async () => {
    if (!params.collectionId) return; // ✅ Verifica que params.collectionId existe
    try {
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET",
      });
      const data = await res.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[collectionId_GET]", err);
    }
  };

  useEffect(() => {
    getCollectionDetails();
  }, [params.collectionId]); // ✅ Se ejecuta cuando cambia collectionId

  return loading ? <Loader /> : <CollectionForm initialData={collectionDetails} />;
};

export default CollectionDetails;
