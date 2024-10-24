import { CardType } from '@/constants/cards';

export interface Card {
  brand: CardType;
  country: string;
  last4: string;
  fingerprint: string;
  exp_month: number;
  exp_year: number;
}

export interface PaymentMethod {
  id: string;
  card: Card;
}
