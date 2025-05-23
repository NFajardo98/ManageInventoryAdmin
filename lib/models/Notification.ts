import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  supplier: { type: String, required: true },
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  message: { type: String, required: true },
  deliveryAddress: { type: String, default: "Not provided" }, // Campo para la dirección
  deliveryCity: { type: String, default: "Not provided" },    // Campo para la ciudad
  email: { type: String, required: true },
  status: { type: String, enum: ["initial", "pending", "completed"], default: "initial" }, // Agregamos el estado "initial"
  createdAt: { type: Date, default: Date.now },
});

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;