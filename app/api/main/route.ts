import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Inventory from "@/lib/models/Inventory";
import Supplier from "@/lib/models/Supplier";
import Order from "@/lib/models/Order";

import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();

    // Contar el número de documentos en cada colección
    const totalProducts = await Product.countDocuments();
    const lowStockItems = await Inventory.countDocuments({ $expr: { $lt: ["$stock", "$threshold"] } });
    const totalSuppliers = await Supplier.countDocuments();

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });

    // Calcular la suma de totalAmount de los pedidos completados
    const pendingOrdersTotalAmount = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalPendingAmount = pendingOrdersTotalAmount[0]?.total || 0;

    // Encontrar el ranking de productos más pedidos en los pedidos completados
    const topOrderedProducts = await Order.aggregate([
      { $match: { status: "completed" } }, // Filtrar pedidos completados
      { $unwind: "$products" }, // Descomponer el array de productos
      {
        $group: {
          _id: "$products.title", // Agrupar por el título del producto
          totalQuantity: { $sum: "$products.quantity" }, // Sumar las cantidades
        },
      },
      {
        $project: {
          _id: 0,
          title: "$_id", // Usar el título como identificador
          totalQuantity: 1, // Incluir la cantidad total
        },
      },
      { $sort: { totalQuantity: -1 } }, // Ordenar por cantidad total en orden descendente
    ]);

    // Calcular la proyección de inventario
    const ingredientsUsed = await Order.aggregate([
      { $match: { status: "completed" } }, // Filtrar pedidos completados
      { $unwind: "$products" }, // Descomponer el array de productos
      { $unwind: "$products.ingredients" }, // Descomponer el array de ingredientes
      {
        $group: {
          _id: "$products.ingredients.ingredientId", // Agrupar por el ID del ingrediente
          totalQuantityUsed: {
            $sum: {
              $multiply: ["$products.ingredients.quantity", "$products.quantity"], // Multiplicar la cantidad del ingrediente por la cantidad del producto
            },
          },
          firstSaleDate: { $min: "$createdAt" }, // Fecha de la primera venta
          lastSaleDate: { $max: "$createdAt" }, // Fecha de la última venta
        },
      },
      {
        $lookup: {
          from: "inventories", // Relacionar con la colección de inventarios
          localField: "_id", // Campo en el resultado del grupo
          foreignField: "_id", // Campo en la colección de inventarios
          as: "inventoryDetails", // Nombre del campo resultante
        },
      },
      {
        $project: {
          _id: 0,
          ingredientId: "$_id", // Mostrar el ID del ingrediente
          ingredientName: { $arrayElemAt: ["$inventoryDetails.title", 0] }, // Mostrar el nombre del ingrediente
          unit: { $arrayElemAt: ["$inventoryDetails.unit", 0] }, // Mostrar la unidad del ingrediente
          stock: { $arrayElemAt: ["$inventoryDetails.stock", 0] }, // Mostrar el stock actual
          threshold: { $arrayElemAt: ["$inventoryDetails.threshold", 0] }, // Mostrar el umbral de restock
          totalQuantityUsed: 1, // Mostrar la cantidad total utilizada
          firstSaleDate: 1, // Mostrar la fecha de la primera venta
          lastSaleDate: 1, // Mostrar la fecha de la última venta
        },
      },
      {
        $addFields: {
          daysBetween: {
            $add: [
              1, // Sumar 1 día adicional
              {
                $max: [
                  0, // Evitar valores negativos
                  {
                    $ceil: { // Truncar para obtener días enteros
                      $divide: [
                        { $subtract: ["$lastSaleDate", "$firstSaleDate"] },
                        1000 * 60 * 60 * 24, // Convertir milisegundos a días
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          dailyAverage: {
            $cond: [
              { $gt: ["$totalQuantityUsed", 0] }, // Si se ha usado algo del ingrediente
              {
                $divide: [
                  { $toDouble: "$totalQuantityUsed" }, // Convertir a número
                  { $toDouble: "$daysBetween" }, // Convertir a número
                ],
              },
              0, // Si no se ha usado nada, el promedio es 0
            ],
          },
        },
      },
      {
        $addFields: {
          daysLeft: {
            $cond: [
              { $and: [{ $gt: ["$dailyAverage", 0] }, { $gt: ["$stock", "$threshold"] }] }, // Si dailyAverage > 0 y stock > threshold
              {
                $ceil: { // Redondear hacia arriba
                  $divide: [
                    { $subtract: ["$stock", "$threshold"] }, // Diferencia entre stock y threshold
                    "$dailyAverage", // Dividir por el promedio diario
                  ],
                },
              },
              null, // Si no se puede calcular, devolver null
            ],
          },
        },
      },
      {
        $addFields: {
          debugInfo: {
            stock: "$stock",
            threshold: "$threshold",
            dailyAverage: "$dailyAverage",
            stockMinusThreshold: { $subtract: ["$stock", "$threshold"] },
          },
        },
      },
    ]);


    // Calcular los productos con mayor margen de beneficio
    const mostProfitableProducts = await Product.aggregate([
      {
        $project: {
          title: 1, // Incluir el título del producto
          price: { $toDouble: "$price" }, // Convertir Decimal128 a número
          expense: { $toDouble: "$expense" }, // Convertir Decimal128 a número
          profitMargin: { $subtract: [{ $toDouble: "$price" }, { $toDouble: "$expense" }] }, // Calcular margen de beneficio
        },
      },
      { $sort: { profitMargin: -1 } }, // Ordenar por margen de beneficio descendente
      { $limit: 10 }, // Limitar a los 10 productos más rentables
    ]);

    console.log("[mostProfitableProducts] ✅", mostProfitableProducts);
    // Tendencias de ventas
    const salesTrends = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      totalProducts,
      lowStockItems,
      totalSuppliers,
      pendingOrders,
      completedOrders,
      totalPendingAmount,
      topOrderedProducts, // Ranking de productos más pedidos
      ingredientsUsed, // Proyección de inventario
      mostProfitableProducts, // Productos más rentables
      salesTrends, // Tendencias de ventas
    });
  } catch (err) {
    console.error("[statistics_GET] ❌", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};