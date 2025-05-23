import nodemailer from "nodemailer";
import EmailConfig from "@/lib/models/EmailConfig";
import { connectToDB } from "@/lib/mongoDB";

export const sendEmail = async (to: string, subject: string, text: string, deliveryAddress: string, deliveryCity: string) => {
  try {
    await connectToDB();

    // Obtiene la configuración SMTP desde la base de datos
    const config = await EmailConfig.findOne();
    if (!config) {
      throw new Error("SMTP configuration not found");
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

        // Construye el cuerpo del correo electrónico
    const emailBody = `
      ${text || config.defaultMessage}

      Delivery Address: ${deliveryAddress || "Not provided"}
      Delivery City: ${deliveryCity || "Not provided"}
      Deliver to: ${config.topic || "Not provided"}
    `;

    await transporter.sendMail({
      from: `"Inventory System" <${config.smtpUser}>`, // Remitente dinámico
      to, // Destinatario
      subject, // Asunto del correo
      text: emailBody, // Mensaje dinámico o predeterminado
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};