import { getRefundReasons } from '@/services/API/refunds';
import useSWR from 'swr/immutable';

const useRefundReasons = () => {
  const { data, error } = useSWR('/refunds/reasons', getRefundReasons);

  return {
    refundReasons: data,
    error,
    isLoading: !error && !data,
  };
};

export default useRefundReasons;
