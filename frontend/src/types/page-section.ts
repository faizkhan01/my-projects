import { GetProductsParams } from '@/services/API/products';
import { Category } from './categories';
import { Product } from './products';

export interface PageSection {
  id: number;
  name: string;
  order: number;
  type:
    | 'product_list'
    | 'promotion_banner_grid'
    | 'promotion_banner'
    | 'categories_grid';
  products?: Product[];
  categories?: Category[];
  data?: {
    widgetType: 'list' | 'carousel';
    queryParams?: Partial<GetProductsParams>;
  };
  settings?: {
    backgroundColor: string;
  };
}

export type PageFooter = {
  href: string;
  name: string;
  links: PageFooterLink[];
}[];

export interface PageFooterLink {
  href: string;
  name: string;
}
