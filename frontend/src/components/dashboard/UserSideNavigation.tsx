import { Box, Typography } from '@mui/material';
import { ProfileData } from '@/types/user';
import { SideNavigationLinks, SideLink } from './SideNavigationLinks';
import { MobileHeader } from './MobileHeader';
import { DesktopHeader } from './DesktopHeader';
import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';
import { SignOut } from '@phosphor-icons/react';
import { useChats } from '@/hooks/queries/useChats';
import useProfile from '@/hooks/queries/useProfile';
import { CustomContainer } from '@/ui-kit/containers';

interface Props {
  profile: ProfileData;
}

// Make a wrapper component for the SideLink to add a counter
// This way it will only re render this component and no all the other links
const NotificationWrapper = (
  props?: Partial<ComponentProps<typeof SideLink>>,
) => {
  const { profile } = useProfile();
  return (
    <SideLink
      item={{
        exact: true,
        label: 'Notification',
        value: routes.DASHBOARD.NOTIFICATIONS,
        counter: profile?.notificationsCount || undefined,
      }}
      // The ...props is required to pass the isMobile prop from SideNavigationLinks
      {...props}
    />
  );
};

const MessagesWrapper = (props?: Partial<ComponentProps<typeof SideLink>>) => {
  const { data } = useChats();
  const count = data?.unreadCount || undefined;
  return (
    <SideLink
      item={{
        exact: true,
        label: 'Messages',
        value: routes.DASHBOARD.MESSAGES.LIST,
        counter: count,
      }}
      // The ...props is required to pass the isMobile prop from SideNavigationLinks
      {...props}
    />
  );
};

const ITEMS = [
  <SideLink
    key="overview"
    item={{
      exact: true,
      label: 'Overview',
      value: routes.DASHBOARD.INDEX,
    }}
  />,
  <SideLink
    key="cart"
    item={{
      value: routes.CART.INDEX,
      label: 'My cart',
    }}
  />,
  <SideLink
    key="orders"
    item={{
      value: routes.DASHBOARD.MY_ORDERS,
      label: 'My orders',
    }}
  />,
  <SideLink
    key="wishlist"
    item={{
      value: routes.WISHLIST.INDEX,
      label: 'My wishlist',
    }}
  />,
  <SideLink
    key="refund"
    item={{
      value: routes.DASHBOARD.REFUND_RETURN,
      label: 'Refund and return',
    }}
  />,
  <NotificationWrapper key="notification" />,
  <MessagesWrapper key="messages" />,
  <SideLink
    key="pm"
    item={{
      value: routes.DASHBOARD.PAYMENT_METHODS,
      label: 'Payment methods',
    }}
  />,
  <SideLink
    key="billing"
    item={{
      value: routes.DASHBOARD.BILLING,
      label: 'Billing addresses',
    }}
  />,
  <SideLink
    key="shipping"
    item={{
      value: routes.DASHBOARD.SHIPPING,
      label: 'Shipping addresses',
    }}
  />,
  <SideLink
    key="sell"
    item={{
      value: routes.SELL.INDEX,
      label: 'Sell with Only Latest',
    }}
  />,
  <SideLink
    key="news"
    item={{
      value: routes.DASHBOARD.NEWS_LETTERS,
      label: 'News letters',
    }}
  />,
  <SideLink
    key="help"
    item={{
      value: routes.HELP_CENTER,
      label: 'Help center',
    }}
  />,
  <SideLink
    key="logout"
    item={{
      value: routes.LOGOUT.INDEX,
      label: 'Sign out',
      rightIcon: <SignOut />,
      color: 'error.main',
      avoidNextLink: true,
    }}
    onlyMobile
  />,
];

export const UserSideNavigation = ({ profile }: Props) => {
  const pathname = usePathname();
  const isInDashboard = pathname === routes.DASHBOARD.INDEX;

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 'auto' },
        display: {
          xs: isInDashboard ? 'block' : 'none',
          md: 'block',
        },
      }}
    >
      <MobileHeader profile={profile} />
      <Box
        sx={{
          backgroundColor: 'common.white',
          margin: {
            md: '40px 80px 0px 0px',
          },
        }}
        component="aside"
      >
        <DesktopHeader profile={profile} />
        <CustomContainer disableMediumPadding disableLargePadding>
          <Box
            mt="40px"
            mb="130px"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px 0px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '24px',
              }}
              component="h3"
            >
              Account Settings
            </Typography>
            <SideNavigationLinks items={ITEMS} />
          </Box>
        </CustomContainer>
      </Box>
    </Box>
  );
};
