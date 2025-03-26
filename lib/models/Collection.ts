// Importamos mongoose, una biblioteca para trabajar con MongoDB en Node.js
import mongoose from "mongoose";

// Definimos el esquema de la colección (Collection), que representará una entidad en la base de datos
const collectionSchema = new mongoose.Schema({
  // Almacena el título de la colección
  title: {
    type: String, 
    required: true, 
    unique: true, // Debe ser único en la base de datos
  },
  // Almacena la descripción de la colección (opcional)
  description: String,

  // Guarda la URL de la imagen de la colección
  image: {
    type: String, 
    required: true, // Es obligatorio
  },

  order: {
    type: Number,
    required: true,
    unique: true, // Asegura que cada colección tenga un número único
  },

  // Almacena un array de identificadores de productos relacionados con la colección
  products: [       
    {
      type: mongoose.Schema.Types.ObjectId, // Referencia a documentos de la colección 'Product'
      ref: "Product", // Relación con la colección "Product" en la base de datos
    }
  ],

  // Guarda la fecha de creación de la colección
  createdAt: {
    type: Date, 
    default: Date.now, // Se establece automáticamente con la fecha actual al crear el documento
  },

  // Guarda la fecha de última actualización de la colección
  updatedAt: {
    type: Date, 
    default: Date.now, 
  }
});

// Creamos el modelo de la colección en MongoDB
// Si ya existe el modelo 'Collection' lo reutilizamos, si no, lo creamos a partir del esquema
const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

// Exportamos el modelo para ser utilizado en otras partes del proyecto
export default Collection;
