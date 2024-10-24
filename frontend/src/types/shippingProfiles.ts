import { Country } from './countries';

export interface ShippingProfile {
  id: number;
  name: string;
  description: string | null;
  maxProcessingDays: number;
  minProcessingDays: number;
  forOneProduct: boolean;
  type: string;
  fromCountry: Country;
  areas: ShippingProfileArea[];
}

export interface ShippingProfileArea {
  id: number;
  countries?: Country[];
  countryIds?: number[];
  carrier: string;
  everyWhere: boolean;
  price: number;
  minDays: number;
  maxDays: number;
}

export type ShippingProfileAreaWithoutId = Omit<ShippingProfileArea, 'id'>;

export interface ShippingProfileFormValues {
  name: string;
  description: string;
  countryId: number;
  minProcessingDays: number;
  maxProcessingDays: number;
  areas: {
    id?: number;
    carrier: string;
    price: number;
    minDays: number;
    maxDays: number;
    everyWhere: boolean;
    countryIds?: number[];
    countries?: Country[];
    confirmed: boolean | undefined;
  }[];
}

export type ProductShippingProfileFormValues = Omit<
  ShippingProfileFormValues,
  'name' | 'description'
>;
