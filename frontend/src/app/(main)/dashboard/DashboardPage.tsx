'use client';
import { Box } from '@mui/material';
import UserOverview from '@/views/dashboard/customer/Overview';
import SellerOverview from '@/views/dashboard/seller/Overview';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { USER_ROLES } from '@/constants/auth';
import { ProfileData } from '@/types/user';

const Dashboard = ({ profile }: { profile: ProfileData }) => {
  const role = profile?.role;

  const renderDashboard = () => {
    switch (role) {
      case USER_ROLES.USER:
        return (
          <DashboardLayout profile={profile} title="Overview">
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
              }}
            >
              <UserOverview profile={profile} />
            </Box>
          </DashboardLayout>
        );
      case USER_ROLES.SELLER:
        return (
          <SellerDashboardLayout title="Dashboard" hideTitleOnMobile={false}>
            <SellerOverview />
          </SellerDashboardLayout>
        );
      default:
        return null;
    }
  };

  return renderDashboard();
};

export default Dashboard;
