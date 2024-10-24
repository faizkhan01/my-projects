import { CUSTOMER } from '@/constants/api';
import { getFollowingStores } from '@/services/API/following';
import SWRImmutable from 'swr/immutable';

const useFollowingStores = (active = true) => {
  const { data, error } = SWRImmutable(
    active ? CUSTOMER.FOLLOWING : null,
    getFollowingStores,
  );

  return {
    followingStores: data,
    isLoading: !error && data === undefined,
    isError: error,
  };
};

export default useFollowingStores;
