import { CATEGORIES } from '@/constants/api';
import { getCategories } from '@/services/API/categories';
import useSWRImmutable from 'swr/immutable';

const useCategories = () => {
  const { data, error } = useSWRImmutable(CATEGORIES.LIST, () =>
    getCategories(),
  );

  return {
    categories: data,
    error,
    isLoading: !data && !error,
  };
};

export default useCategories;
