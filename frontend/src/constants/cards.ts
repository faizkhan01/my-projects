/* import { StripeCardNumberElementChangeEvent } from "@stripe/stripe-js"; */

export type CardType = 'mastercard' | 'amex' | 'discover' | 'visa';

export const CARDS: {
  [key in CardType]: string;
} = {
  mastercard: '/assets/cards/mastercard.svg',
  amex: '/assets/cards/amex.svg',
  discover: '/assets/cards/discover.svg',
  visa: '/assets/cards/visa.svg',
};
