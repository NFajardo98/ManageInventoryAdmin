import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      title: String,
      allergens: [String],
      quantity: Number,
      ingredients: [
        {
          ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory", // Relación con el inventario
          },
          quantity: Number, // Cantidad requerida de este ingrediente
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;