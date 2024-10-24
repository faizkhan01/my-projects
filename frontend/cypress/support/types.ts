export interface User {
  avatar?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'SELLER';
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number;
}
