import type { Product } from './products';

export interface ViewedProduct {
  id: number;
  product: Product;
  createdAt: string;
}
