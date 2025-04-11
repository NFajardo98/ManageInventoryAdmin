import { CollectionType } from "./collection";

export type ProductType = {
    _id: string;
    title: string;
    description: string;
    media: [string];

    collections: [CollectionType];
    allergens: [string];
    price: number;
    expense: number;
    createdAt: Date;
    updatedAt: Date;
  }