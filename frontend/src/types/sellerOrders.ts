import { Order, OrderItem } from './orders';

export interface SellerOrder extends Order {
  id: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shipping: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    addressOne: string;
    addressTwo: string;
    zipCode: string;
  };
}
