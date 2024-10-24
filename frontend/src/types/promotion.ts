import { GetProductsParams } from '@/services/API/products';
import { Image } from './image';
import { Product } from './products';

export interface Promotion {
  id: number;
  title: string;
  slug: string;
  active: boolean;
  showOnHomepage: boolean;
  queryParams: Partial<GetProductsParams>;
  products: Product[];
  banner: Image;
}
