import { ProductType } from './product';
import { InventoryColumnType } from './inventory';

export type OrderItemType = {
  _id: string; // Agrega la propiedad _id
  product: ProductType;
  allergens: [string];
  ingredients: {
    inventory: InventoryColumnType; // Referencia al inventario
    quantity: number; // Cantidad asociada
  }[];
  title: string;
  quantity: number;
};