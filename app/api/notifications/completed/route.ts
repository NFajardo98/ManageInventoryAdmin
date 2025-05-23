import { NextRequest, NextResponse } from "next/server";
import Notification from "@/lib/models/Notification";
import Inventory from "@/lib/models/Inventory";
import { connectToDB } from "@/lib/mongoDB";

export const POST = async (req: NextRequest) => {
  try {
    console.log("[completeNotification_POST] Connecting to database...");
    await connectToDB();

    const { id } = await req.json(); // ID de la notificación
    console.log(`[completeNotification_POST] Received notification ID: ${id}`);

    // Buscar la notificación
    const notification = await Notification.findById(id);
    if (!notification) {
      console.error("[completeNotification_POST] Notification not found");
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    console.log("[completeNotification_POST] Notification found:", notification);

    // Actualizar el estado de la notificación a "completed"
    notification.status = "completed";
    await notification.save();
    console.log("[completeNotification_POST] Notification status updated to 'completed'");

    // Buscar el inventario relacionado utilizando inventoryId
    const inventory = await Inventory.findById(notification.inventoryId);
    if (!inventory) {
      console.error("[completeNotification_POST] Inventory not found for ID:", notification.inventoryId);
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }
    console.log("[completeNotification_POST] Inventory found:", inventory);

    // Actualizar el stock del inventario
    const previousStock = inventory.stock;
    inventory.stock += inventory.restockAmount; // Suma el restockAmount al stock actual
    await inventory.save();
    console.log(
      `[completeNotification_POST] Inventory stock updated: Previous stock = ${previousStock}, Restock amount = ${inventory.restockAmount}, New stock = ${inventory.stock}`
    );

    // Eliminar la notificación
    await Notification.findByIdAndDelete(id);
    console.log(`[completeNotification_POST] Notification with ID ${id} deleted`);

    return NextResponse.json({ message: "Notification marked as completed, inventory updated, and notification deleted" });
  } catch (err) {
    console.error("[completeNotification_POST] ❌ Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};