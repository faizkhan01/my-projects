import { Box, Typography } from '@mui/material';
import { ProfileData } from '@/types/user';
import { useRouter } from 'next/navigation';
import routes from '@/constants/routes';
import CustomerAvatar from './CustomerAvatar';
import { OverviewCards } from '@/views/dashboard/customer/components/OverviewCards';

interface Props {
  profile: ProfileData;
}

export const MobileHeader = ({ profile }: Props) => {
  const { push } = useRouter();

  const handleEditProfile = () => {
    push(routes.DASHBOARD.EDIT_PROFILE);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        flexDirection: 'column',
        justifyContent: { xs: 'center', md: 'flex-start' },
        alignItems: { xs: 'center', md: 'flex-start' },
        paddingTop: '24px',
        backgroundColor: { xs: '#F6F9FF', md: 'common.white' },
      }}
    >
      <CustomerAvatar profile={profile} variant="mobile" />
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '18px',
          lineHeight: '32px',
          mt: '3px',
        }}
      >
        {`${profile.firstName} ${profile.lastName}`}
      </Typography>
      <Typography
        onClick={handleEditProfile}
        sx={{
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '18px',
          mt: '3px',
          color: 'primary.main',
          cursor: 'pointer',
        }}
      >
        Edit profile
      </Typography>
      <Box
        sx={{
          mt: '20px',
          width: '100%',
          display: { xs: 'block', md: 'none' },
          background:
            'linear-gradient(180deg, rgba(246,249,255,1) 50%, rgba(255,255,255,1) 50%)',
        }}
      >
        <OverviewCards
          onClickFollowing={() => push(routes.DASHBOARD.FOLLOWING)}
          iconSize="small"
        />
      </Box>
    </Box>
  );
};
