import { CollectionType } from "./collection";
import { InventoryColumnType } from "./inventory";

export type ProductType = {
    _id: string;
    title: string;
    description: string;
    media: [string];
    collections: [CollectionType];
    inventories: {
      inventory: InventoryColumnType; // Referencia al inventario
      quantity: number; // Cantidad asociada
    }[];
    allergens: [string];
    price: number;
    expense: number;
    createdAt: Date;
    updatedAt: Date;
  }