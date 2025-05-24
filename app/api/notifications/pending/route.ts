import { NextRequest, NextResponse } from "next/server";
import Notification from "@/lib/models/Notification";
import { sendEmail } from "@/lib/utils/emailUtils";
import { connectToDB } from "@/lib/mongoDB";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { id } = await req.json(); // ID de la notificación
    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Enviar el correo
    await sendEmail(notification.email, "Low Stock Alert", notification.message, notification.deliveryAddress, notification.deliveryCity);

    // Actualizar el estado de la notificación a "pending"
    notification.status = "pending";
    await notification.save();

    return NextResponse.json({ message: "Email sent and notification updated" });
  } catch (err) {
    console.error("[sendNotification_POST] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};