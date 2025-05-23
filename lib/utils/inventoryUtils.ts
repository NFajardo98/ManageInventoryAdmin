import Inventory from "@/lib/models/Inventory";
import Notification from "@/lib/models/Notification";

export const checkThreshold = async () => {
  const lowStockItems = await Inventory.aggregate([
    {
      $match: {
        $expr: { $lt: ["$stock", "$threshold"] }, // Compara stock con threshold
      },
    },
    {
      $lookup: {
        from: "suppliers", // Nombre de la colección de proveedores
        localField: "supplier",
        foreignField: "_id",
        as: "supplier",
      },
    },
  ]);

  const notifications = [];

  for (const item of lowStockItems) {
    const supplier = item.supplier[0]; // Asume un proveedor por simplicidad
    if (supplier && supplier.email) {
      const message = `Stock for ${item.title} is below the threshold (${item.threshold}). Please restock ${item.restockAmount}.`;

      // Verificar si ya existe una notificación activa
      let notification = await Notification.findOne({
        supplier: supplier.title,
        inventoryId: item._id, // Verifica también por inventoryId
        status: { $in: ["initial", "pending"] }, // Verifica estados activos
      });

      if (!notification) {
        // Crear una nueva notificación si no existe
        notification = await Notification.create({
          supplier: supplier.title,
          inventoryId: item._id, // Relacionar la notificación con el inventario
          message,
          email: supplier.email,
          status: "initial", // Estado inicial
        });
      }

      // Agregar la notificación (existente o nueva) al array
      notifications.push(notification);
    }
  }

  return notifications;
};