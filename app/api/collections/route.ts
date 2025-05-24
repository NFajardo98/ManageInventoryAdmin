import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server"; // Importamos `currentUser` en lugar de `auth`
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";

// Manejo de la solicitud POST para crear una nueva colección
export const POST = async (req: NextRequest) => {
  try {
    // Obtenemos el usuario autenticado
    const user = await currentUser();

    // Si no hay usuario autenticado, devolvemos error de acceso no autorizado
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Conectamos a la base de datos
    await connectToDB();

    // Extraemos los datos enviados en el cuerpo de la petición
    const { title, description, image } = await req.json();

    // Verificamos si ya existe una colección con el mismo título
    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // Validamos que los campos obligatorios estén presentes
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // Obtener el último valor de `order` y calcular el siguiente
    const lastCollection = await Collection.findOne({ order: { $exists: true } }).sort({ order: -1 });
    const nextOrder = lastCollection && typeof lastCollection.order === "number" ? lastCollection.order + 1 : 1;

    // Creamos la nueva colección con los datos proporcionados
    const newCollection = await Collection.create({
      title,
      description,
      image,
      order: nextOrder, // Asignar el valor calculado
    });

    // Guardamos la nueva colección en la base de datos
    await newCollection.save();

    // Respondemos con la colección creada en formato JSON
    return NextResponse.json(newCollection, { status: 200 });
  } catch (err) {
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Manejo de la solicitud GET para obtener todas las colecciones
export const GET = async () => {
  try {
    console.log("🔍 Connecting to the database...");
    await connectToDB();

    console.log("🔍 Fetching collections from MongoDB...");
    const collections = await Collection.find().sort({ order: 1 });

    console.log("✅ Collections found:", collections.length);
    
    if (!collections || collections.length === 0) {
      console.warn("⚠️ No collections found in the database.");
    }

    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.error("[collections_GET] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    // Conectamos a la base de datos
    await connectToDB();

    // Extraemos los datos enviados en el cuerpo de la petición
    const { collectionId, direction } = await req.json();

    // Validamos los datos recibidos
    if (!collectionId || !direction) {
      return new NextResponse("Collection ID and direction are required", { status: 400 });
    }

    // Obtenemos la colección actual
    const currentCollection = await Collection.findById(collectionId);
    if (!currentCollection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    // Verificar si la colección está en el límite superior o inferior
    if (direction === "up" && currentCollection.order === 1) {
      return new NextResponse("Cannot move collection further up", { status: 400 });
    }

    // Calculamos el número total de colecciones
    const totalCollections = await Collection.countDocuments();

    if (direction === "down" && currentCollection.order === totalCollections) {
      return new NextResponse("Cannot move collection further down", { status: 400 });
    }

    // Determinamos la dirección del movimiento (arriba o abajo)
    const swapOrder = direction === "up" ? currentCollection.order - 1 : currentCollection.order + 1;

    // Buscamos la colección con el `order` que queremos intercambiar
    const swapCollection = await Collection.findOne({ order: swapOrder });
    if (!swapCollection) {
      return new NextResponse("Cannot move in the specified direction", { status: 400 });
    }

    // Paso 1: Asignar un valor temporal para evitar conflictos
    await Collection.updateOne({ _id: swapCollection._id }, { $set: { order: -1 } });

    // Paso 2: Actualizar el `order` de la colección actual
    const originalOrder = currentCollection.order; // Guardamos el valor original de `order`
    currentCollection.order = swapOrder;
    await currentCollection.save();

    // Paso 3: Actualizar el `order` de la colección intercambiada
    swapCollection.order = originalOrder;
    await swapCollection.save();

    return new NextResponse("Order updated successfully", { status: 200 });
  } catch (err) {
    console.error("[collections_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
// Forzamos que esta API sea dinámica en Next.js, para que no use caché en las respuestas
export const dynamic = "force-dynamic";