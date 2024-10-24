export interface SellerPayout {
  id: number;
  amount: number;
  stripePayoutId: null | number;
  currency: string;
  arrivalDate: Date;
  confirmedAt: null | Date;
  rejectedAt: null | Date;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
}
