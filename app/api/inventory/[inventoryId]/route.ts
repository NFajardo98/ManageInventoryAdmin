import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` para autenticación
import { connectToDB } from "@/lib/mongoDB";
import Inventory from "@/lib/models/Inventory";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> }
) => {
  try {
    await connectToDB();

    const { inventoryId } = await params; // Usa await para desestructurar params

    const inventory = await Inventory.findById(inventoryId).populate("supplier");

    if (!inventory) {
      return new NextResponse(
        JSON.stringify({ message: "Inventory item not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(inventory, { status: 200 });
  } catch (err) {
    console.log("[inventoryId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // Usa await para desestructurar params
    const { inventoryId } = await params;

    let inventory = await Inventory.findById(inventoryId);

    if (!inventory) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    const { title, stock, unit, description, supplier, threshold, restockAmount } =
      await req.json();
      //console.log("Request body:", await req.json());
    if (!title || !stock || !unit || !supplier || !threshold || !restockAmount) {
      return new NextResponse("All fields are required", { status: 400 });
    }


    inventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      { title, stock, unit, description, supplier, threshold, restockAmount },
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