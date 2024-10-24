import useSWRImmutable from 'swr/immutable';
import type { ValidateStoreName } from '@/types/stores';
import { STORES } from '@/constants/api';
import { validateStoreName } from '@/services/API/stores';

const useValidateStore = (name?: string) => {
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<ValidateStoreName>(
      () => (name ? `${STORES.VALIDATE_STORE_NAME}/${name}` : null),
      () => validateStoreName(name as string),
    );

  return {
    isValid: data,
    isLoading,
    isValidating,
    isError: error,
  };
};

export default useValidateStore;
