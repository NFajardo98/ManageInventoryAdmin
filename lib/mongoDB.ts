import mongoose from "mongoose";
import Supplier from "@/lib/models/Supplier"; // Importa el modelo Supplier

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true)

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    if (!mongoose.models.Supplier) {
      mongoose.model("Supplier", Supplier.schema);
    }

    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "MI_Admin"
    })

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (err) {
    console.log(err)
  }
}