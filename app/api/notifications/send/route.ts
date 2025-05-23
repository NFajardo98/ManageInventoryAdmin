import { NextRequest, NextResponse } from "next/server";
import Notification from "@/lib/models/Notification";
import { connectToDB } from "@/lib/mongoDB";
import { sendEmail } from "@/lib/utils/emailUtils";
import EmailConfig from "@/lib/models/EmailConfig"; // Importa el modelo EmailConfig

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { id } = await req.json();

    // Buscar la notificación por ID
    const notification = await Notification.findById(id);
    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    // Obtener deliveryAddress y deliveryCity desde EmailConfig
    const emailConfig = await EmailConfig.findOne();
    if (!emailConfig) {
      return new NextResponse("Email configuration not found", { status: 404 });
    }


    // Enviar el correo utilizando emailUtils
    await sendEmail(notification.email, "Low Stock Notification", notification.message, emailConfig.deliveryAddress, emailConfig.deliveryCity, emailConfig.topic);

    // Actualizar el estado de la notificación a "pending"
    notification.deliveryAddress = emailConfig.deliveryAddress;
    notification.deliveryCity = emailConfig.deliveryCity;
    notification.topic = emailConfig.topic;
    notification.status = "pending";
    await notification.save();

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("[sendNotification_POST] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};