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

    // Creamos la nueva colección con los datos proporcionados
    const newCollection = await Collection.create({
      title,
      description,
      image,
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
export const GET = async (req: NextRequest) => {
  try {
    // Conectamos a la base de datos
    await connectToDB();

    // Obtenemos todas las colecciones ordenadas por fecha de creación (más reciente primero)
    const collections = await Collection.find().sort({ createdAt: "desc" });

    // Respondemos con la lista de colecciones en formato JSON
    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Forzamos que esta API sea dinámica en Next.js, para que no use caché en las respuestas
export const dynamic = "force-dynamic";
