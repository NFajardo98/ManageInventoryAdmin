import { SupplierType } from "./supplier";

export type InventoryColumnType = {
    _id: string;
    title: string; // Nombre del alimento (ej. "Carne de ternera", "CocaCola")
    stock: number; // Cantidad disponible
    unitPrice: number; // Precio por unidad (ej. "2.50")
    unit: string; // Unidad de medida (ej. "kilos", "unidades", "litros")
    supplier: SupplierType[]; // Nombre del proveedor asociado
    description: string; // Descripción del alimento
    threshold: number; // Umbral para avisar al proveedor
    restockAmount: number; // Cantidad a solicitar al proveedor
    updatedAt: string; // Fecha de actualización
    createdAt: string; // Fecha de creación
  };