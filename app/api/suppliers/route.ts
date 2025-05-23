import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Supplier from "@/lib/models/Supplier";

// Maneja el método GET para obtener todos los proveedores
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const suppliers = await Supplier.find().sort({ createdAt: "desc" });

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, description, email, address, city, country } = await req.json();

    if (!title || !email || !address || !city || !country) {
      return new NextResponse("Title and email are required", { status: 400 });
    }

    const normalizedTitle = title.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const newSupplier = await Supplier.create({
      title: normalizedTitle,
      email: normalizedEmail,
      description,
      address,
      city,
      country,
    });

    return NextResponse.json(newSupplier, { status: 200 });
  } catch (err) {
    console.log("[suppliers_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";