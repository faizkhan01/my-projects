'use client';
import { ProfileData } from '@/types/user';
import { CustomContainer } from '@/ui-kit/containers';
import { UserSideNavigation } from '@/components/dashboard/UserSideNavigation';
import { Typography, Grid, Theme, SxProps } from '@mui/material';

interface Props {
  children: React.ReactNode;
  profile: ProfileData;
  title: string;
  containerSx?: SxProps<Theme>;
}

export const DashboardLayout = ({
  children,
  profile,
  title,
  containerSx,
}: Props) => {
  return (
    <CustomContainer
      disableMobilePadding
      sx={{
        display: 'flex',
        marginTop: {
          md: '28px',
        },
        flexDirection: 'column',
        ...containerSx,
      }}
    >
      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontWeight: 600,
          fontSize: '48px',
          lineHeight: '48px',
        }}
        component="h2"
      >
        {title}
      </Typography>
      <Grid container>
        <Grid item xs md={3}>
          <UserSideNavigation profile={profile} />
        </Grid>
        <Grid item xs={12} md={9}>
          <CustomContainer
            sx={{
              marginTop: {
                xs: '0',
                md: '40px',
              },
              width: '100%',
            }}
            disableMediumPadding
            disableLargePadding
          >
            {children}
          </CustomContainer>
        </Grid>
      </Grid>
    </CustomContainer>
  );
};
