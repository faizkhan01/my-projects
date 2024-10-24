'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import useFollowingStores from '@/hooks/queries/useFollowingStores';
import MyFollowings from '@/components/dashboard/MyFollowings';
import { ProfileData } from '@/types/user';
import { FollowedStore } from '@/types/stores';
import { SWRConfig } from 'swr/_internal';
import { CUSTOMER } from '@/constants/api';

const Content = ({ profile }: { profile: ProfileData }) => {
  const { followingStores } = useFollowingStores();

  return (
    <DashboardLayout profile={profile} title="Following">
      {followingStores && <MyFollowings stores={followingStores} />}
    </DashboardLayout>
  );
};

const Following = ({
  profile,
  following,
}: {
  profile: ProfileData;
  following: FollowedStore[];
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          [CUSTOMER.FOLLOWING]: following,
        },
      }}
    >
      <Content profile={profile} />
    </SWRConfig>
  );
};

export default Following;
