// Importamos la librería Mongoose, que nos permite interactuar con MongoDB
import mongoose from "mongoose";

// Variable global que indica si la conexión a la base de datos ya ha sido establecida
let isConnected: boolean = false; 

// Función asíncrona para conectar con la base de datos MongoDB
export const connectToDB = async (): Promise<void> => {
  
  // Configura Mongoose para que solo permita consultas estrictas,
  // lo que evita el uso de filtros desconocidos en consultas y mejora la seguridad.
  mongoose.set("strictQuery", true); 

  // Si la conexión ya está establecida, se muestra un mensaje y se detiene la ejecución
  if (isConnected) { 
    console.log("MongoDB is already connected"); 
    return; // Salimos de la función para evitar intentar conectar nuevamente
  }

  try {
    // Intentamos conectar con MongoDB utilizando la URL almacenada en las variables de entorno
    await mongoose.connect(process.env.MONGODB_URL || "", { 
      dbName: "Borcelle_Admin", // Especificamos el nombre de la base de datos a la que nos conectaremos
    });

    // Si la conexión es exitosa, marcamos isConnected como verdadero
    isConnected = true; 
    console.log("MongoDB is connected"); // Mensaje de confirmación en la consola
  } catch (err) {
    // Si ocurre un error durante la conexión, lo mostramos en la consola
    console.log(err); 
  }
};
