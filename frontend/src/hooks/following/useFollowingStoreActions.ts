import { CUSTOMER } from '@/constants/api';
import { USER_ROLES } from '@/constants/auth';
import { createFollowStore, deleteFollowStore } from '@/services/API/following';
import { uniqueId } from 'lodash';
import { mutate } from 'swr';
import useFollowingStores from '../queries/useFollowingStores';
import useProfile from '../queries/useProfile';
import useAuthModalStore from '../stores/useAuthModalStore';
import { Store } from '@/types/stores';

export const useFollowingStoreActions = (store: Store) => {
  const openAuth = useAuthModalStore((state) => state.open);

  const { followingStores, isLoading: isLoadingFollowing } =
    useFollowingStores();
  const { profile, isLoggedIn } = useProfile();

  const isSeller = profile?.role === USER_ROLES.SELLER;
  const handleFollow = () => {
    if (isSeller) return;
    if (!isLoggedIn || !profile) return openAuth('login');

    mutate(CUSTOMER.FOLLOWING, createFollowStore(store.id), {
      rollbackOnError: true,
      populateCache: false,
      optimisticData: (current: typeof followingStores) => {
        const newFollowingStores: typeof followingStores = [
          ...(current ?? []),
          {
            id: Number(uniqueId()),
            store: {
              id: store.id,
              name: store.name,
              slug: store.slug,
              logo: store.logo,
            },
            user_id: profile.id,
            store_id: store.id,
          },
        ];

        return newFollowingStores;
      },
    });
  };
  const handleUnfollow = async () => {
    if (!isLoggedIn || !profile || isSeller) return;

    mutate(CUSTOMER.FOLLOWING, deleteFollowStore(store.id), {
      rollbackOnError: true,
      populateCache: false,
      optimisticData: (current: typeof followingStores) => {
        const newFollowingStores: typeof followingStores = current?.filter(
          (c) => c.id !== store.id,
        );

        return newFollowingStores ?? [];
      },
    });
  };
  const isFollowing = followingStores?.find((s) => s.store_id === store.id);

  return {
    isFollowing,
    onFollow: handleFollow,
    onUnfollow: handleUnfollow,
    isLoading: isLoadingFollowing,
    isSeller,
  };
};
