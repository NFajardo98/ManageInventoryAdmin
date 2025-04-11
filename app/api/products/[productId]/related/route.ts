import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    await connectToDB();

    const { productId } = await params; // Usa `await` para desestructurar `params`

    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const relatedProducts = await Product.find({
      $or: [{ collections: { $in: product.collections } }],
      _id: { $ne: product._id }, // Excluye el producto actual
    });

    if (!relatedProducts || relatedProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No related products found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (err) {
    console.log("[related_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
