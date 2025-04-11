import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` en lugar de `auth`
import Inventory from "@/lib/models/Inventory";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    await connectToDB();

    // Usa `await` para desestructurar `params`
    const { productId } = await params;

    // Consulta el producto y popula los datos de los inventarios y colecciones
    const product = await Product.findById(productId)
      .populate({
        path: "inventory", // Popula los datos del inventario
        select: "title _id quantity", // Selecciona los campos necesarios
      })
      .populate({
        path: "collections", // Popula las colecciones relacionadas
        select: "title _id", // Selecciona los campos necesarios
      });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.MANAGE_INVENTORY_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: { productId: string } }
) => {
  try {

    const { params } = context; // Extrae `params` del contexto
    console.log("✅ Received params:", params); // Log para verificar el valor de params
    // Asegúrate de que `params` esté resuelto
    if (!params || !params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    if (!params || !params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const {
      title,
      description,
      media,
      inventory,
      collections,
      allergens,
      price,
      expense,
    } = await req.json();

    if (
      !title ||
      !description ||
      !media ||
      !inventory ||
      !price ||
      !expense ||
      !Array.isArray(collections)
    ) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    // Filtrar added y removed inventory
    const addedInventory = inventory
      .map((item: { ingredientId: string; quantity: number }) => item.ingredientId)
      .filter(
        (ingredientId: string) =>
          !product.inventory.some(
            (inv: any) =>
              inv.ingredientId && inv.ingredientId.toString() === ingredientId
          )
      );

    const removedInventory = product.inventory.filter(
      (inv: any) =>
        !inventory.some(
          (item: { ingredientId: string; quantity: number }) =>
            inv.ingredientId &&
            inv.ingredientId.toString() === item.ingredientId
        )
    );

    // Actualizar inventario
    await Promise.all([
      ...addedInventory.map((ingredientId: string) =>
        Inventory.findByIdAndUpdate(ingredientId, {
          $push: { products: product._id },
        })
      ),
      ...removedInventory.map((inv: any) =>
        Inventory.findByIdAndUpdate(inv.ingredientId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        inventory: inventory.map((item: { ingredientId: string; quantity: number; title: string }) => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          title: item.title,
        })),
        collections: collections.map((id: string) => id),
        allergens,
        price,
        expense,
      },
      { new: true }
    )
      .populate({ path: "collections", model: Collection })
      .populate({ path: "inventory.ingredientId", model: Inventory });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId).populate("collections");

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    // Update collections
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

