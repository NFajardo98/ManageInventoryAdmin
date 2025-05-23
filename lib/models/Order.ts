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
            ref: "Inventory",
          },
          quantity: Number,
        },
      ],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending", // Valor por defecto
  },
  table: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;