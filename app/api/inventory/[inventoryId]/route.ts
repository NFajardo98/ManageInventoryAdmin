import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` para autenticación
import { connectToDB } from "@/lib/mongoDB";
import Inventory from "@/lib/models/Inventory";

export const GET = async (
  req: NextRequest,
  { params }: { params: { inventoryId: string } }
) => {
  try {
    await connectToDB();

    // Encuentra el inventario por ID
    const inventory = await Inventory.findById(params.inventoryId).populate("supplier");

    if (!inventory) {
      return new NextResponse(
        JSON.stringify({ message: "Inventory item not found" }),
        { status: 404 }
      );
    }

    // Devuelve los detalles del inventario
    return NextResponse.json(inventory, { status: 200 });
  } catch (err) {
    console.log("[inventoryId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { inventoryId: string } }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let inventory = await Inventory.findById(params.inventoryId);

    if (!inventory) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    const { title, quantity, unit, description, supplier } = await req.json();

    if (!title || !quantity || !unit || !supplier) {
      return new NextResponse(
        "Title, quantity, unit, and supplier are required",
        { status: 400 }
      );
    }

    inventory = await Inventory.findByIdAndUpdate(
      params.inventoryId,
      { title, quantity, unit, description, supplier },
      { new: true }
    );

    await inventory.save();

    return NextResponse.json(inventory, { status: 200 });
  } catch (err) {
    console.log("[inventoryId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { inventoryId: string } }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Inventory.findByIdAndDelete(params.inventoryId);

    return new NextResponse("Inventory item is deleted", { status: 200 });
  } catch (err) {
    console.log("[inventoryId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";