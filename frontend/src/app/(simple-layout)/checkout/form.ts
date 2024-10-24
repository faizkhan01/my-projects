import { type StripeCardFieldsChangeEvent } from '@/components/stripe/StripeFields';
import { type AddressFormData } from '@/types/address';

export interface CheckoutForm {
  paymentMethod: 'new_card' | { id: string };
  card?: CheckoutCard;
  shipping: AddressFormData;
  savedShipping: number | null;
  isGuest: boolean;
  guestEmail: string;

  billing: AddressFormData;
  billingSameAsShipping: boolean;
  savedBilling: number | null;

  canDeliver: boolean; // Used to know if it can deliver, if no, then it won't allow to submit
}

type CardStatus = Pick<StripeCardFieldsChangeEvent, 'complete' | 'empty'>;

export interface CheckoutCard {
  holder: string;
  number: CardStatus;
  cvc: CardStatus;
  expiry: CardStatus;
}
