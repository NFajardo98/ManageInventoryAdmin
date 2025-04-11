import { ProductType } from './product';

export type OrderItemType = {
  _id: string; // Agrega la propiedad _id
  product: ProductType;
  allergens: [string];
  title: string;
  quantity: number;
};