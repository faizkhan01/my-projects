import type { Product } from './products';

export interface WishlistItem {
  id: number;
  product: Product;
  product_id: number;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export type WishlistItemNoProduct = Omit<WishlistItem, 'product'>;

export type Wishlist = WishlistItem[];
