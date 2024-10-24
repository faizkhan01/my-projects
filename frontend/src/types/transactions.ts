export interface Transaction {
  id: string;
  orderNumber: string;
  orderId: number;
  description: string;
  amount: number;
  amountRefunded: number;
  created: Date;
  paid: boolean;
  refunded: boolean;
  disputed: boolean;
  status: string;
  currency: string;
  fees: number;
}
