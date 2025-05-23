import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import Inventory from "@/lib/models/Inventory";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` en lugar de `auth`
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    await connectToDB();

    // Usa `await` para desestructurar `params`
    const { productId } = await params;

    // Consulta el producto y popula los datos de las colecciones
    const product = await Product.findById(productId)
      .populate({
        path: "collections", // Popula las colecciones relacionadas
        select: "title _id", // Selecciona los campos necesarios
      })
      .populate({
        path: "inventories", // Popula las colecciones relacionadas
        select: "title _id", // Selecciona los campos necesarios
      });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const productData = product.toObject();

    // Convierte `price` y `expense` explícitamente a números
    productData.price = parseFloat(productData.price.toString());
    productData.expense = parseFloat(productData.expense.toString());

    return new NextResponse(JSON.stringify(productData), {
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
  { params }: { params: Promise<{ productId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    // Usa `await` para desestructurar `params`
    const { productId } = await params;
    console.log("✅ Received productId:", productId); // Log para verificar el valor de productId

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(productId);

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
      collections,
      inventories,
      allergens,
      price,
      expense,
    } = await req.json();

    if (
      !title ||
      !description ||
      //!media ||
      !price ||
      !expense ||
      !Array.isArray(collections)
    ) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        collections: collections.map((id: string) => id), // Procesa las colecciones como un array de IDs
        inventories: inventories.map((inventory: { inventory: string; quantity: number }) => ({
          inventory: inventory.inventory, // ID del inventario
          quantity: inventory.quantity,   // Cantidad asociada
        })), // Procesa los inventarios como un array de objetos con ID y cantidad
        allergens,
        price,
        expense,
      },
      { new: true }
    )
      .populate({ path: "collections", model: Collection }) // Popula las colecciones
      .populate({ path: "inventories.inventory", model: Inventory }); // Popula los inventarios

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    // Usa `await` para desestructurar `params`
    const { productId } = await params;
    console.log("✅ Received productId:", productId); // Log para verificar el valor de productId

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(productId).populate("collections");

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

