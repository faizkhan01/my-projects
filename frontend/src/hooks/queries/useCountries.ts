import { COUNTRIES } from '@/constants/api';
import { getCountries, getSellerCountries } from '@/services/API/countries';
import SWRImmutable from 'swr/immutable';

const useCountries = (active = true) => {
  const { data, error, isLoading, isValidating } = SWRImmutable(
    active ? COUNTRIES.LIST : null,
    getCountries,
  );

  return {
    countries: data,
    isLoading,
    isValidating,
    isError: error,
  };
};

export const userSellerCountries = (active = true) => {
  const { data, error, isLoading, isValidating } = SWRImmutable(
    active ? COUNTRIES.LIST_ONLY_SELLERS : null,
    getSellerCountries,
  );

  return {
    countries: data,
    isLoading,
    isValidating,
    isError: error,
  };
};

export default useCountries;
