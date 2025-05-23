import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/mongoDB";
import Supplier from "@/lib/models/Supplier";

// Obtener un proveedor por ID
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) => {
  try {
    const { supplierId } = await params;

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

// Actualizar un proveedor por ID
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) => {
  try {
    const { supplierId } = await params;

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return new NextResponse(
        JSON.stringify({ message: "Supplier not found" }),
        { status: 404 }
      );
    }

    const { title, description, email, address, city, country } = await req.json();

    if (!title || !email) {
      return new NextResponse("Title and email are required", { status: 400 });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      { title, description, email, address, city, country},
      { new: true }
    );

    return NextResponse.json(updatedSupplier, { status: 200 });
  } catch (err) {
    console.log("[supplierId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Eliminar un proveedor por ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) => {
  try {
    const { supplierId } = await params;

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

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

export const dynamic = "force-dynamic";