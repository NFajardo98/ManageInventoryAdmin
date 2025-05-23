import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

// Obtener una colección por ID
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) => {
  try {
    await connectToDB();

    // Usa `await` para desestructurar `params`
    const { collectionId } = await params;

    // Encuentra la colección por ID
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    // Encuentra los productos asociados a la colección
    const products = await Product.find({ collections: collectionId });

    // Devuelve los detalles de la colección junto con los productos
    return NextResponse.json({ ...collection.toObject(), products }, { status: 200 });
  } catch (err) {
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// Actualizar una colección por ID
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Usa `await` para desestructurar `params`
    const { collectionId } = await params;

    let collection = await Collection.findById(collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    collection = await Collection.findByIdAndUpdate(
      collectionId,
      { title, description, image },
      { new: true }
    );

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// Eliminar una colección por ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Usa `await` para desestructurar `params`
    const { collectionId } = await params;

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    await Collection.findByIdAndDelete(collectionId);

    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";