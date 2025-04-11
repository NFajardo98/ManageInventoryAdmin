"use client";

import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductType } from "@/lib/types/product"; // Importar el tipo ProductType

const ProductDetails = () => {
  const params = useParams(); // ⬅ Obtiene los parámetros de la URL
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);

  const getProductDetails = async () => {
    console.log("✅ Params productId:", params.productId); // Verifica el productId
    if (!params.productId) return; // Evitar llamadas innecesarias
  
    try {
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log("✅ Product details fetched:", data); // Aquí
      setProductDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[productId_GET]", err);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [params.productId]); // Se ejecuta cuando cambia `productId`

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;
