import { COUNTRIES } from '@/constants/api';
import { getCountryStates } from '@/services/API/countries';
import SWRImmutable from 'swr/immutable';

const useCountryStates = (id: number) => {
  const { data, error, isLoading, isValidating } = SWRImmutable(
    id > 0 ? COUNTRIES.STATES(id) : null,
    () => getCountryStates(id),
  );

  return {
    states: data,
    isLoading,
    isValidating,
    isError: error,
  };
};

export default useCountryStates;
