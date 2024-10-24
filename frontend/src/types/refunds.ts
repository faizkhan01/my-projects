import { Image } from './image';
import { OrderItem } from './orders';

export interface Refund {
  id: number;
  createdAt: string;
  description: string;
  amount: number;
  stripeRefundId: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  orderItem?: OrderItem;
  reason?: RefundReason;
  decisionReason?: string;
  images: Image[];
}

export interface RefundWithExtraData extends Refund {
  customerName: string;
  orderId: number;
  orderNumber: string;
}

export interface RefundReason {
  id: number;
  name: string;
}
