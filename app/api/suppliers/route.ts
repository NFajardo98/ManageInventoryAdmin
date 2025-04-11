import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Supplier from "@/lib/models/Supplier";

// Maneja el método GET para obtener todos los proveedores
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const suppliers = await Supplier.find(); // Obtiene todos los proveedores de la base de datos

    return NextResponse.json(suppliers, { status: 200 });
  } catch (err) {
    console.log("[suppliers_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Maneja el método POST para crear un nuevo proveedor
export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDB();

    const { title, description } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const existingSupplier = await Supplier.findOne({ title });

    if (existingSupplier) {
      return new NextResponse("Supplier already exists", { status: 400 });
    }

    const newSupplier = await Supplier.create({
      title,
      description,
    });

    await newSupplier.save();

    return NextResponse.json(newSupplier, { status: 200 });
  } catch (err) {
    console.log("[suppliers_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};