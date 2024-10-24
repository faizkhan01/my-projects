import { Typography } from '@mui/material';
import { ProfileData } from '@/types/user';
import { OverviewCards } from './components/OverviewCards';
import MyFollowings from '@/components/dashboard/MyFollowings';
import useFollowingStores from '@/hooks/queries/useFollowingStores';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  profile: ProfileData;
}

const UserOverview = ({ profile }: Props) => {
  const { followingStores } = useFollowingStores();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [clickedFollowing, setClickedFollowing] = useState(false);

  const handleChangeHash = () => {
    if (
      typeof window !== 'undefined' &&
      window?.location?.hash === '#following'
    ) {
      setClickedFollowing(true);
    }
  };

  useEffect(() => {
    handleChangeHash();
  }, []);

  return (
    <div>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: '28.8px',
        }}
      >
        {`${profile.firstName} ${profile.lastName}`}
      </Typography>
      <OverviewCards
        onClickFollowing={() => {
          if (clickedFollowing) {
            replace(pathname.replace('#following', ''));
            return setClickedFollowing(false);
          }

          replace('#following');
          setClickedFollowing(true);
        }}
        selected={{
          following: clickedFollowing,
        }}
      />
      {followingStores && clickedFollowing && (
        <MyFollowings stores={followingStores} />
      )}
    </div>
  );
};

export default UserOverview;
