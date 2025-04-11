import mongoose from "mongoose";
import Supplier from "./Supplier"; // Importa el modelo Supplier para registrarlo

const inventorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: {
    type: String,
    enum: ["kilos", "grams", "units"], // Lista predefinida de unidades
    required: true,
  },
  description: { type: String },
  supplier: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier", // Relación con el modelo Supplier
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;