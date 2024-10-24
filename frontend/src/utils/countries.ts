import { Country } from '@/types/countries';

export const getCountryFromList = (
  countries: Country[],
  identifier: string | number | Country,
) => {
  const compareWith =
    typeof identifier === 'object' ? identifier?.id : identifier;
  return countries?.find(
    (c) =>
      c.id === compareWith ||
      c.iso2 === compareWith?.toString() ||
      c.iso3 === compareWith?.toString(),
  );
};
