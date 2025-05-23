import mongoose, { Schema, model, models } from "mongoose";

const EmailConfigSchema = new Schema({
  smtpHost: { type: String, required: true },
  smtpPort: { type: Number, required: true },
  smtpUser: { type: String, required: true },
  smtpPass: { type: String, required: true },
  topic: { type: String, required: true }, // Dirección de entrega
  deliveryAddress: { type: String, required: true }, // Dirección de entrega
  deliveryCity: { type: String, required: true }, // Ciudad de entrega
});

const EmailConfig = models.EmailConfig || model("EmailConfig", EmailConfigSchema);

export default EmailConfig;