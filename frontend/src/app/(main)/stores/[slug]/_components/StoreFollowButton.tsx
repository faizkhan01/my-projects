'use client';
import { useFollowingStoreActions } from '@/hooks/following/useFollowingStoreActions';
import { Store } from '@/types/stores';
import { OutlinedButton, ContainedButton } from '@/ui-kit/buttons';

const StoreFollowButton = ({ store }: { store: Store }) => {
  const { isFollowing, onFollow, onUnfollow, isLoading, isSeller } =
    useFollowingStoreActions(store);

  return isFollowing ? (
    <OutlinedButton
      onClick={() => onUnfollow()}
      className="w-full sm:w-[170px]"
    >
      Unfollow
    </OutlinedButton>
  ) : (
    <ContainedButton
      loading={isLoading}
      onClick={() => onFollow}
      disabled={isSeller}
      className="w-full sm:w-[170px]"
    >
      Follow
    </ContainedButton>
  );
};

export default StoreFollowButton;
