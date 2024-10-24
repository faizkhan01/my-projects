export interface AddressFormData {
  firstName: string;
  lastName: string;
  email?: string | null;
  default?: boolean;
  phone: string;
  country: number | string;
  state: number;
  city: string;
  addressOne: string;
  addressTwo: string;
  zipCode: string;
}

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  user: number;
  email: string | null;
  default: boolean;
  phone: string;
  city: string;
  addressOne: string;
  addressTwo: string;
  zipCode: string;
  country: {
    id: number;
    name: string;
    emoji: string;
    iso2: string;
    iso3: string;
  };
  state: {
    id: number;
    name: string;
  };
}

export enum ADDRESS_TYPES_ENUM {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

export type AddressTypes =
  | ADDRESS_TYPES_ENUM.SHIPPING
  | ADDRESS_TYPES_ENUM.BILLING;
