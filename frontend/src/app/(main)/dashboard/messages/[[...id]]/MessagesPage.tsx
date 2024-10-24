'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { UserMessages } from '@/components/userMessages/UserMessages';
import { USER_ROLES } from '@/constants/auth';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { ProfileData } from '@/types/user';

const MessagesPage = ({ profile }: { profile: ProfileData }) => {
  const role = profile.role;
  const title = 'Messages';

  const renderDashboard = () => {
    switch (role) {
      case USER_ROLES.USER:
        return (
          <DashboardLayout
            profile={profile}
            title={title}
            containerSx={{
              padding: {
                xs: '0px',
                md: '0 40px', // INFO: We need this so the chat covers all the with of the screen on mobile devices
                lg: '0 80px',
              },
            }}
          >
            <UserMessages profile={profile} />
          </DashboardLayout>
        );
      case USER_ROLES.SELLER:
        return (
          <SellerDashboardLayout
            title={title}
            hideTitleOnMobile
            containerSx={{
              padding: {
                xs: '0',
                md: '0 40px',
                lg: '0 80px',
              },
            }}
          >
            <UserMessages profile={profile} />
          </SellerDashboardLayout>
        );
      default:
        return null;
    }
  };

  return renderDashboard();
};

export default MessagesPage;
