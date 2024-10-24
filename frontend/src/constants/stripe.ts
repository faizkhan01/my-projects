export const STRIPE_EURO_IBAN_COUNTRIES = [
  'FR',
  'DE',
  'ES',
  'IT',
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'GI',
  'GR',
  'HU',
  'CH',
  'IE',
  'PT',
  'RO',
  'SK',
  'SI',
  'SE',
  'NL',
  'MT',
  'LU',
  'LV',
  'NO',
  'PL',
  'LT',
  'LI',
  'GB', // This one accepts IBAN and another format of Sort Code and Account Number
] as const;

export const STRIPE_EURO_COUNTRIES = [...STRIPE_EURO_IBAN_COUNTRIES] as const;

export const STRIPE_NON_EURO_COUNTRIES = [
  'US',
  'CA',
  'AU',
  'SG',
  'NZ',
] as const;

export const STRIPE_ALL_COUNTRIES = [
  ...STRIPE_EURO_COUNTRIES,
  ...STRIPE_NON_EURO_COUNTRIES,
] as const;

export type StripeCountryCodes = (typeof STRIPE_ALL_COUNTRIES)[number];
