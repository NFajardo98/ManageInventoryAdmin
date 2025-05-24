import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Inventory from "@/lib/models/Inventory";

//export const getOrders = async () => {
//  try {
//    const orders = await Order.find()
//      .populate({
//        path: "products.ingredients.ingredientId", // Popular el campo ingredientId
//        select: "title", // Solo traer el campo title del modelo Inventory
//      })
//      .exec();

//    return orders;
//  } catch (err) {
//    console.error("Error fetching orders:", err);
//    throw new Error("Failed to fetch orders");
//  }
//};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) => {
  try {
    await connectToDB();

    const { orderId } = await context.params; // Usa await para resolver params

    // Buscar el pedido y popular los productos e ingredientes
    const order = await Order.findById(orderId).populate({
      path: "products.ingredients.ingredientId",
      select: "title stock", // Incluye los campos necesarios
    });

    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    console.log("Populated Order:", JSON.stringify(order, null, 2));

    // Obtener los precios de los productos desde la tabla Product
    const productIds = order.products.map((product: { product: string }) => product.product);
    const productsWithPrices = await Product.find({ _id: { $in: productIds } }).select(
      "_id price"
    );

    // Crear un mapa para acceder rápidamente a los precios por ID
    const productPriceMap = new Map(
      productsWithPrices.map((product) => [product._id.toString(), product.price])
    );

    // Calcular el totalAmount
    const totalAmount = order.products.reduce((acc: number, product: { product?: string; quantity: number }) => {
      if (!product.product) {
        console.warn(`Product ID is missing for one of the products:`, product);
        return acc; // Ignorar productos sin ID
      }

      const productPrice = productPriceMap.get(product.product.toString()) || 0;
      return acc + productPrice * product.quantity;
    }, 0);

    // Actualizar el totalAmount en el pedido
    order.totalAmount = totalAmount;

    // Actualizar los inventarios
    for (const product of order.products) {
      for (const ingredient of product.ingredients) {
        // Validar que ingredient.ingredientId no sea null o undefined
        if (!ingredient.ingredientId || !ingredient.ingredientId._id) {
          console.error(
            `Ingredient ID is missing or invalid for ingredient: ${JSON.stringify(
              ingredient
            )}`
          );
          return new NextResponse(
            JSON.stringify({
              message: `Ingredient ID is missing or invalid for one of the ingredients.`,
            }),
            { status: 400 }
          );
        }

        const inventoryId = ingredient.ingredientId._id; // ID del inventario
        const quantityToDeduct = ingredient.quantity * product.quantity; // Cantidad a restar

        // Validar que la cantidad sea un número válido
        if (isNaN(quantityToDeduct) || quantityToDeduct <= 0) {
          return new NextResponse(
            JSON.stringify({
              message: `Invalid quantity for ingredient: ${inventoryId}`,
            }),
            { status: 400 }
          );
        }
        console.log(`Stock for ingredient ${inventoryId}`);

        // Buscar el inventario correspondiente
        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
          return new NextResponse(
            JSON.stringify({
              message: `Inventory item not found for ingredient: ${inventoryId}`,
            }),
            { status: 404 }
          );
        }
        console.log(`Stock for ingredient ${inventory.title} (${inventoryId}): ${inventory.stock}`);

        // Restar la cantidad del stock
        inventory.stock -= quantityToDeduct;

        // Validar que el stock no sea negativo
        if (inventory.stock < 0) {
          return new NextResponse(
            JSON.stringify({
              message: `Insufficient stock for inventory item: ${inventory.title}`,
            }),
            { status: 400 }
          );
        }

        // Guardar los cambios en el inventario
        await inventory.save();
      }
    }

    // Marcar el pedido como aceptado
    order.status = "accepted";
    await order.save();

    return new NextResponse(
      JSON.stringify({ message: "Order accepted and inventories updated" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("[orderId_POST]", err);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error:   
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as { message?: unknown }).message === "string"
              ? (err as { message: string }).message
              : "Unknown error",
      }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) => {
  try {
    await connectToDB();

    const { orderId } = await params; // <-- Desestructura usando await

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return new NextResponse("Order deleted successfully", { status: 200 });
  } catch (err) {
    console.log("[order_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) => {
  try {
    await connectToDB();

    const { orderId } = await context.params;

    const order = await Order.findById(orderId).populate({
      path: "products.ingredients.ingredientId",
      select: "title stock",
    });

    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    // Actualizar los inventarios
    for (const product of order.products) {
      for (const ingredient of product.ingredients) {
        if (!ingredient.ingredientId || !ingredient.ingredientId._id) {
          return new NextResponse(
            JSON.stringify({
              message: `Ingredient ID is missing or invalid for one of the ingredients.`,
            }),
            { status: 400 }
          );
        }

        const inventoryId = ingredient.ingredientId._id;
        const quantityToDeduct = ingredient.quantity * product.quantity;

        if (isNaN(quantityToDeduct) || quantityToDeduct <= 0) {
          return new NextResponse(
            JSON.stringify({
              message: `Invalid quantity for ingredient: ${inventoryId}`,
            }),
            { status: 400 }
          );
        }

        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
          return new NextResponse(
            JSON.stringify({
              message: `Inventory item not found for ingredient: ${inventoryId}`,
            }),
            { status: 404 }
          );
        }

        inventory.stock -= quantityToDeduct;

        if (inventory.stock < 0) {
          return new NextResponse(
            JSON.stringify({
              message: `Insufficient stock for inventory item: ${inventory.title}`,
            }),
            { status: 400 }
          );
        }

        await inventory.save();
      }
    }

    // Marcar el pedido como completado
    order.status = "completed";
    await order.save();

    return new NextResponse(
      JSON.stringify({ message: "Order marked as completed and inventory updated" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("[orderId_PATCH]", err);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
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