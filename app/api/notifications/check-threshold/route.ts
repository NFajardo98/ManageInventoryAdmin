import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { checkThreshold } from "@/lib/utils/inventoryUtils";

export const GET = async () => {
  try {
    await connectToDB();

    // Ejecuta la función para verificar los umbrales
    const notifications = await checkThreshold();
    console.log("Notifications fetched:", notifications);

    // Devuelve las notificaciones generadas
    return NextResponse.json(notifications, { status: 200 });
  } catch (err) {
    console.error("[checkThreshold_GET] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};