import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/mongoDB";
import Supplier from "@/lib/models/Supplier";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ supplierId: string }> } // Cambia el tipo de `params` a una promesa
) => {
  try {
    const { supplierId } = await context.params; // Usa `await` para desestructurar `params`
    console.log("✅ Received supplierId:", supplierId);

    await connectToDB();

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(supplier, { status: 200 });
  } catch (err) {
    console.log("[supplierId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { supplierId: string } }
) => {
  try {
    await connectToDB();

    const deletedSupplier = await Supplier.findByIdAndDelete(params.supplierId);

    if (!deletedSupplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Supplier deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.log("[supplierId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { supplierId: string } }
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    await connectToDB();

    const supplier = await Supplier.findById(params.supplierId);

    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not found" }),
        { status: 404 }
      );
    }

    const { title, description, email, phone } = await req.json();

    if (!title || !email) {
      return new NextResponse(
        JSON.stringify({ message: "Title and email are required" }),
        { status: 400 }
      );
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      params.supplierId,
      { title, description, email, phone },
      { new: true }
    );

    return NextResponse.json(updatedSupplier, { status: 200 });
  } catch (err) {
    console.log("[supplierId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";