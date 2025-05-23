import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface InventoryItem {
  inventory: string;
  quantity: number;
}

interface CartProduct {
  _id: string;
  title: string;
  price: number;
  allergens?: string[];
  inventories: InventoryItem[];
}

interface CartItem {
  item: CartProduct;
  quantity: number;
}

interface Customer {
  clerkId: string;
}

export async function POST(req: NextRequest) {
  try {
    // Conecta a la base de datos
    await connectToDB();

    // Obtén los datos del cuerpo de la solicitud
    const { cartItems, customer, totalAmount, table }: {
      cartItems: CartItem[];
      customer: Customer;
      totalAmount: number;
      table: string;
    } = await req.json();

    // Validación de datos
    if (!cartItems || !customer || !totalAmount || !table) {
      return new NextResponse("Missing required fields", { status: 400, headers: corsHeaders });
    }

    // Crea un nuevo pedido
    const newOrder = new Order({
      customerClerkId: customer.clerkId, // ID del cliente
      products: cartItems.map((item) => {
        const productData = {
          productId: item.item._id,
          title: item.item.title,
          quantity: item.quantity,
          price: item.item.price,
          allergens: item.item.allergens || [],
          ingredients: item.item.inventories.map((inventory) => ({
            ingredientId: inventory.inventory,
            quantity: inventory.quantity,
          })) || [],
        };
        console.log("✅ Processing cart item for order:", productData); 
    
        return productData;
      }),
      totalAmount, 
      createdAt: new Date(), 
      table
    });

    // Guarda el pedido en la base de datos
    await newOrder.save();

    // Responde con éxito
    return NextResponse.json({ message: "Order created successfully", order: newOrder }, { headers: corsHeaders });
  } catch (err) {
    console.error("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
}