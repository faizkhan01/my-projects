import { Image } from './image';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: Image;
  children: Category[];
  parent?: Category;
  parentId?: number;
  isProductType?: boolean;
}
