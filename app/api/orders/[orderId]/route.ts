import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
  try {
    await connectToDB();

    const deletedOrder = await Order.findByIdAndDelete(params.orderId);

    if (!deletedOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return new NextResponse("Order deleted successfully", { status: 200 });
  } catch (err) {
    console.log("[order_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) => {
  try {
    await connectToDB();

    // Desenvuelve `params` correctamente
    const { orderId } = await params;

    // Validar el formato del orderId
    if (!orderId || orderId.length !== 24) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid order ID format" }),
        { status: 400 }
      );
    }

    const orderDetails = await Order.findById(orderId).populate({
      path: "products.product",
      model: Product,
    });

    if (!orderDetails) {
      return new NextResponse(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json({ orderDetails }, { status: 200 });
  } catch (err) {
    console.log("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
