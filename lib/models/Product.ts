import mongoose from "mongoose";
import { title } from "process";

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  media: [String],
  inventory: [
    {
      ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }, // Referencia a la colección Inventory
      quantity: { type: Number, required: true },
      title: { type: String, required: true },
    },
  ],  
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  allergens: [String],
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  expense: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;