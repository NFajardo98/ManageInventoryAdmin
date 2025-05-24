import { ProductType } from "./product";

export type CollectionType = {
    _id: string;
    title: string;
    order: number;
    products?: ProductType[];
  };