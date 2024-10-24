import { ADDRESSES_CRUD_TYPES } from '@/constants/api';
import { getAddresses } from '@/services/API/addresses';
import { AddressTypes } from '@/types/address';
import useSWR from 'swr';

const useAddresses = (type: AddressTypes, active = true) => {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    active ? ADDRESSES_CRUD_TYPES.GET[type] : null,
    () => getAddresses(type),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    addresses: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
};

export default useAddresses;
