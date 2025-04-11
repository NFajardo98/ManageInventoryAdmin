import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Debe ser único en la base de datos
  },
  email: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);

export default Supplier;