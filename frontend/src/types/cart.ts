import type { Product } from './products';

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  selected: boolean;
}

export type Cart = CartItem[];

export interface CartDeliveryTime {
  id: number;
  minDays?: number;
  maxDays?: number;
  deleted: boolean;
  outOfStock: boolean;
  canDeliver: boolean;
}
