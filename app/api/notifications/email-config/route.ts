import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import EmailConfig from "@/lib/models/EmailConfig";

export const GET = async () => {
  try {
    await connectToDB();

    // Obtiene la configuración actual
    const config = await EmailConfig.findOne();
    if (!config) {
      return NextResponse.json({ error: "No email configuration found" }, { status: 404 });
    }

    return NextResponse.json(config, { status: 200 });
  } catch (err) {
    console.error("[EmailConfig_GET] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();

    // Validar los nuevos campos
    const { smtpHost, smtpPort, smtpUser, smtpPass, deliveryAddress, deliveryCity, topic } = body;
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !deliveryAddress || !deliveryCity || !topic) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    // Actualiza o crea la configuración
    const config = await EmailConfig.findOneAndUpdate(
      {},
      {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        topic,
        deliveryAddress, // Incluye deliveryAddress desde el body
        deliveryCity,
        topic,    // Incluye deliveryCity desde el body
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(config, { status: 200 });
  } catch (err) {
    console.error("[EmailConfig_POST] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};