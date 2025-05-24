import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` en lugar de `auth`
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import Inventory from "@/lib/models/Inventory";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      collections,
      inventories,
      allergens,
      price,
      expense,
    } = await req.json();

    console.log("✅ Data received in POST:", {
      title,
      description,
      media,
      collections,
      inventories,
      allergens,
      price,
      expense,
    });
    
    if (
      !title ||
      !description ||
      !media ||
      !collections ||
      !price ||
      !expense ||
      !Array.isArray(inventories) ||
      !inventories.every(
        (inv: { inventory: string; quantity: number }) =>
          inv.inventory && typeof inv.quantity === "number"
      )
    ) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }
    console.log("✅ Data passed to Product.create:", {
      title,
      description,
      media,
      allergens,
      collections,
      inventories: inventories.map((inventory: { inventory: string; quantity: number }) => ({
        inventory: inventory.inventory,
        quantity: inventory.quantity,
      })),
      price,
      expense,
    });
  
    const newProduct = await Product.create({
      title,
      description,
      media,
      allergens,
      collections,
      inventories: inventories.map((inventory: { inventory: string; quantity: number }) => ({
        inventory: inventory.inventory,
        quantity: inventory.quantity,
      })),
      price,
      expense,
    });
    console.log("New product created:", newProduct);
    await newProduct.save();

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    const populatedProduct = await Product.findById(newProduct._id)
    .populate({ path: "collections", model: Collection })
      .populate({ path: "inventories.inventory", model: Inventory });

    return NextResponse.json(populatedProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });
      
    // Convierte `price` y `expense` a números para cada producto
    const productsData = products.map((product) => {
      const productObj = product.toObject();
      productObj.price = parseFloat(productObj.price.toString());
      productObj.expense = parseFloat(productObj.expense.toString());
      return productObj;
    });

    return NextResponse.json(productsData, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

