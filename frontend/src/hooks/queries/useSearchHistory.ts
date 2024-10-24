import { SEARCH_HISTORY } from '@/constants/api';
import { getSearchHistory } from '@/services/API/search-history';
import useSWR from 'swr';
import { getStorageItem, StorageKeys } from '@/lib/localStorage';
import { USER_ROLES } from '@/constants/auth';
import useProfile from './useProfile';

export const useSearchHistory = (props?: { limit?: number }) => {
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const active =
    !isLoadingProfile &&
    (profile === null || profile?.role === USER_ROLES.USER);

  const { data, error, isLoading } = useSWR(
    active
      ? SEARCH_HISTORY.LIST({
          limit: props?.limit,
        })
      : null,
    () =>
      profile?.id
        ? getSearchHistory(props)
        : getStorageItem(StorageKeys.SEARCH_HISTORY),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    history: data,
    isLoading,
    isError: error,
  };
};
