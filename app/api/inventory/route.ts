import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Inventory from "@/lib/models/Inventory";
//import Supplier from "@/lib/models/Supplier"; // Importa el modelo Supplier

// Manejo de la solicitud GET para obtener todo el inventario
export const GET = async (req: NextRequest) => {
  try {
    // Conectamos a la base de datos
    await connectToDB();

    // Obtenemos todos los elementos del inventario
    const inventory = await Inventory.find().populate("supplier"); // Incluye información del proveedor

    // Respondemos con los datos del inventario en formato JSON
    return NextResponse.json(inventory, { status: 200 });
  } catch (err) {
    console.error("[inventory_GET] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Manejo de la solicitud POST para crear un nuevo elemento del inventario
export const POST = async (req: NextRequest) => {
    try {
      // Conectamos a la base de datos
      await connectToDB();
  
      // Extraemos los datos enviados en el cuerpo de la petición
      const { title, stock, unit, description, supplier, threshold, restockAmount, unitPrice } = await req.json();
  
      // Validamos que los campos obligatorios estén presentes
      if (!title || !stock || !unit || !supplier || !threshold || !restockAmount || !unitPrice) {
        return new NextResponse("Name, stock, unit, and supplier are required", { status: 400 });
      }
  
      // Creamos el nuevo elemento del inventario con los datos proporcionados
      const newInventoryItem = await Inventory.create({
        title,
        stock,
        unitPrice,
        unit: unit,
        description,
        supplier,
        threshold,
        restockAmount,
      });
  
      // Guardamos el nuevo elemento en la base de datos
      await newInventoryItem.save();
  
      // Respondemos con el elemento creado en formato JSON
      return NextResponse.json(newInventoryItem, { status: 201 });
    } catch (err) {
      console.error("[inventory_POST] ❌", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  export const dynamic = "force-dynamic";  