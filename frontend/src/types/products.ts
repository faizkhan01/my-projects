import { Category } from './categories';
import type { Image } from './image';
import { ShippingProfile } from './shippingProfiles';

export interface ProductSearchSuggestion {
  suggestion: string;
  highlight: string;
}

export interface ProductShipsTo {
  id: number | null;
  name: string | null;
  iso2: string | null;
  iso3: string | null;
  everywhere: boolean;
  price: number;
  minProcessingDays: number;
  maxProcessingDays: number;
  minExpectedDays: number;
  maxExpectedDays: number;
}

export interface Product {
  createdAt: number;
  id: number;
  name: string;
  slug: string;
  categories?: Category[]; // Elastic search returns categories as an array
  category?: Category; // Postgres returns just one category, one that doesn't have children
  description: string;
  discount: number;
  price: number;
  stock: number;
  sku: string;
  currency: string;
  published: boolean;
  store: {
    id: number;
    name: string;
    slug: string;
    verified: boolean;
  };
  deletedAt: string | null;
  tags: string[];
  images: Image[];
  rating: number | null;
  totalReviews: number | null;
  shipsTo?: ProductShipsTo[];
}

export type SellerProduct = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'sku'
  | 'price'
  | 'rating'
  | 'stock'
  | 'images'
  | 'description'
  | 'discount'
  | 'category'
  | 'totalReviews'
  | 'published'
  | 'tags'
  | 'currency'
> & {
  shippingProfile: null | ShippingProfile;
};

export interface ProductWithQuantity extends Product {
  quantity: number;
}

// Elastic search available filters
export interface ProductFilters {
  max_price: {
    value: number;
  };
  min_price: {
    value: number;
  };
  categories: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
}

export interface ProductReview {
  id: number;
  comment: string | null;
  rating: number;
  images: Image[];
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}
