import { SupplierType } from "./supplier";

export type InventoryColumnType = {
    _id: string;
    title: string; // Nombre del alimento (ej. "Carne de ternera", "CocaCola")
    quantity: number; // Cantidad disponible
    unit: string; // Unidad de medida (ej. "kilos", "unidades", "litros")
    supplier: SupplierType[]; // Nombre del proveedor asociado
    description: string; // Descripción del alimento
    updatedAt: string; // Fecha de actualización
    createdAt: string; // Fecha de creación
  };