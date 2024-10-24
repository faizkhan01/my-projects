import { getReportCategories } from '@/services/API/productReports';
import SWRImmutable from 'swr/immutable';

const useReportCategories = () => {
  const { data, error, isLoading, isValidating } = SWRImmutable(
    '/product-reports/categories',
    () => getReportCategories(),
  );

  return {
    reportCategories: data,
    isLoading,
    isValidating,
    isError: error,
  };
};

export default useReportCategories;
