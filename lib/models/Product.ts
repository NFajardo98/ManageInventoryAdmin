import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  media: [String],
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  inventories: [
    {
      inventory: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }, // Referencia al inventario
      quantity: { type: Number, required: true }, // Cantidad asociada
    },
  ],
  allergens: [String],
  price: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  expense: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true },   toObject: { getters: true } // Asegúrate de incluir esta línea
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;