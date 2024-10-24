import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import routes from '@/constants/routes';
import { ProfileData } from '@/types/user';
import CustomerAvatar from './CustomerAvatar';

interface Props {
  profile: ProfileData;
}

export const DesktopHeader = ({ profile }: Props) => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      <CustomerAvatar profile={profile} />
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: '32px',
          mt: '16px',
        }}
        component="h3"
      >
        {`${profile.firstName} ${profile.lastName}`}
      </Typography>

      <Box
        sx={{
          mt: '16px',
        }}
      >
        <Link href={routes.DASHBOARD.EDIT_PROFILE} passHref legacyBehavior>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '18px',
              color: 'primary.main',
              textDecoration: 'none',
            }}
            component="a"
          >
            Edit profile
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};
