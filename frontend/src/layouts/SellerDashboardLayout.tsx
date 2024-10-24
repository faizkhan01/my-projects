'use client';
import { ComponentProps, ReactNode, useMemo, useState } from 'react';
import {
  Typography,
  Grid,
  TypographyProps,
  Tooltip,
  Link as MuiLink,
  Button,
  Collapse,
} from '@mui/material';
import { styled, SxProps, Theme } from '@mui/material/styles';
import {
  SideLink,
  SideNavigationLinks,
} from '@/components/dashboard/SideNavigationLinks';
import {
  User,
  SquaresFour,
  ArrowsClockwise,
  EnvelopeSimple,
  ListBullets,
  ShoppingCartSimple,
  Bell,
  ArrowUUpLeft,
  Package,
  /* Wallet, */
  CreditCard,
  GearSix,
  CaretDown,
  CaretUp,
  SignOut,
} from '@phosphor-icons/react';
import { CustomContainer } from '@/ui-kit/containers';
import { ContainedButton } from '@/ui-kit/buttons';
import routes from '@/constants/routes';
import frame from '../assets/images/Frame.png';
import Image from 'next/image';
import useProfile from '@/hooks/queries/useProfile';
import Link from 'next/link';
import { useSellerRequirements } from '@/hooks/queries/useSellerRequirements';
import { useChats } from '@/hooks/queries/useChats';
import { blockedRoutes } from '@/constants/blockedRoutes';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';

interface SellerDashboardLayoutProps {
  children: ReactNode;
  title: string;
  hideTitleOnMobile?: boolean;
  containerSx?: SxProps<Theme>;
}

const Sidebar = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {},
}));

const StoreLogoHolder = styled('div')(({ theme }) => ({
  marginBottom: '16px',
  borderRadius: '10px',
  overflow: 'hidden',
  display: 'flex',
  width: 'fit-content',

  [theme.breakpoints.down('sm')]: {},
}));

const PageTitle = styled((props) => (
  <Typography component="h3" {...props} />
))<TypographyProps>(({ theme }) => ({
  fontSize: '40px',
  fontWeight: '600',
  [theme.breakpoints.down('sm')]: {},
}));

const isRouteBlocked = (route: string, isVerified: boolean): boolean => {
  return (
    blockedRoutes.unverifiedSeller.some(
      (blockedRoute) => blockedRoute === route,
    ) && !isVerified
  );
};

const MessagesWrapper = (
  props?: Partial<ComponentProps<typeof SideLink>> & {
    isVerified: boolean;
  },
) => {
  const { data } = useChats();
  const count = data?.unreadCount || undefined;
  return (
    <SideLink
      item={{
        label: 'Messages',
        value: routes.DASHBOARD.MESSAGES.LIST,
        counter: count,
        leftIcon: <EnvelopeSimple size={18} />,
        disabled: isRouteBlocked(
          routes.DASHBOARD.MESSAGES.LIST,
          Boolean(props?.isVerified),
        ),
      }}
      // The ...props is required to pass the isMobile prop from SideNavigationLinks
      {...props}
    />
  );
};

const StoreName = ({
  name,
  slug,
  isMobile = false,
}: {
  name: string;
  slug: string | null;
  isMobile?: boolean;
}) => {
  return (
    <MuiLink
      underline="hover"
      component={slug ? Link : 'span'}
      sx={{
        fontSize: '24px',
        lineHeight: '32px',
        color: '#333E5C',
        marginBottom: '40px',
        maxWidth: '265px',
        display: 'block',
        fontWeight: '600',

        ...(isMobile && {
          fontSize: '14px',
          margin: '0',
        }),
      }}
      {...(slug && {
        underline: 'hover',
        href: routes.STORES.INFO(slug),
      })}
    >
      {name}
    </MuiLink>
  );
};

export const SellerDashboardLayout = ({
  children,
  title,
  hideTitleOnMobile = true,
  containerSx,
}: SellerDashboardLayoutProps): JSX.Element => {
  const [openLinks, setOpenLinks] = useState(false);
  const { profile } = useProfile();
  const { requirements, isLoading } = useSellerRequirements();
  const current = requirements?.currently_due;
  const past = requirements?.past_due;

  const hasRequirements = Boolean(
    (requirements && current?.length) || past?.length,
  );
  const isVerified = Boolean(profile?.store?.verified);
  const isBankNeeded = current?.[0]?.includes('external_account');

  const logo = profile?.store?.logo?.url;

  const SIDEBAR_ITEMS = useMemo(
    () => [
      <SideLink
        key="dashboard"
        item={{
          label: 'Dashboard',
          value: routes.SELLER_DASHBOARD.INDEX,
          leftIcon: <SquaresFour size={18} />,
          exact: true,
        }}
      />,
      <SideLink
        key="transactions"
        item={{
          label: 'Transactions',
          value: routes.SELLER_DASHBOARD.TRANSACTIONS,
          leftIcon: <ArrowsClockwise size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.TRANSACTIONS,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="notification"
        item={{
          label: 'Notification',
          value: routes.SELLER_DASHBOARD.NOTIFICATION,
          leftIcon: <Bell size={18} />,
          counter: profile?.notificationsCount || undefined,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.NOTIFICATION,
            isVerified,
          ),
        }}
      />,
      <MessagesWrapper key="messages" isVerified={isVerified} />,
      <SideLink
        key="customers"
        item={{
          label: 'Customers',
          value: routes.SELLER_DASHBOARD.CUSTOMERS,
          leftIcon: <User size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.CUSTOMERS,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="products"
        item={{
          label: 'Products',
          value: routes.SELLER_DASHBOARD.PRODUCTS.LIST,
          leftIcon: <ListBullets size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.PRODUCTS.LIST,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="orders"
        item={{
          label: 'Orders',
          value: routes.SELLER_DASHBOARD.ORDERS.LIST,
          leftIcon: <ShoppingCartSimple size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.ORDERS.LIST,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="refund"
        item={{
          label: 'Refund and return',
          value: routes.SELLER_DASHBOARD.REFUND_RETURN,
          leftIcon: <ArrowUUpLeft size={18} weight="fill" />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.REFUND_RETURN,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="shipping"
        item={{
          label: 'Shipping',
          value: routes.SELLER_DASHBOARD.SHIPPING.INDEX,
          leftIcon: <Package size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.SHIPPING.INDEX,
            isVerified,
          ),
        }}
      />,
      <SideLink
        key="bank-account"
        item={{
          label: 'Bank account',
          value: routes.SELLER_DASHBOARD.BANK_ACCOUNT,
          leftIcon: <CreditCard size={18} />,
          disabled: isRouteBlocked(
            routes.SELLER_DASHBOARD.BANK_ACCOUNT,
            isVerified,
          ),
        }}
      />,

      <SideLink
        key="settings"
        item={{
          label: 'Setting',
          value: routes.SELLER_DASHBOARD.SETTING,
          leftIcon: <GearSix size={18} />,
          disabled: isRouteBlocked(routes.SELLER_DASHBOARD.SETTING, isVerified),
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
    ],
    [isVerified, profile?.notificationsCount],
  );

  const verifyAccountTitle = useMemo<string>(() => {
    if (hasRequirements && isBankNeeded) {
      return 'Verify your account to activate payouts';
    }

    if (hasRequirements && isVerified) {
      return 'We need some information to keep your account secure';
    }

    return 'Verify your account to start selling';
  }, [hasRequirements, isBankNeeded, isVerified]);

  useNavigationEvent(() => setOpenLinks(false));

  return (
    <CustomContainer disableMobilePadding sx={{ ...containerSx }}>
      <div className="mb-5 md:hidden">
        <Button
          onClick={() => setOpenLinks((p) => !p)}
          sx={{
            color: 'primary.main',
            height: '41px',
            width: '100%',
            borderBottom: openLinks ? '0px' : '1px solid #EAECF4',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              marginRight: '8px',
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: '120%',
            }}
          >
            Account Settings
          </Typography>
          <div className="text-primary-main">
            {openLinks ? <CaretUp size={12} /> : <CaretDown size={12} />}
          </div>
        </Button>
        <Collapse in={openLinks}>
          <div>
            <div className="mb-5 mt-2 flex items-center px-4">
              <StoreLogoHolder className="mr-3">
                <Image
                  src={logo ? logo : frame}
                  width={56}
                  height={56}
                  alt={`${profile?.store?.name ?? 'Unknown'} logo`}
                  className="object-cover"
                  priority
                />
              </StoreLogoHolder>
              <StoreName
                name={profile?.store?.name ?? ''}
                slug={profile?.store?.slug || null}
                isMobile
              />
            </div>
            <CustomContainer disableMediumPadding disableLargePadding>
              <SideNavigationLinks items={SIDEBAR_ITEMS} />
            </CustomContainer>
          </div>
        </Collapse>
      </div>

      <div
        className={`flex-wrap items-center justify-between gap-4 px-4 pb-6 pt-0 md:flex md:justify-start md:pb-10 md:pt-5 ${
          hideTitleOnMobile ? 'hidden' : 'flex'
        }`}
      >
        <PageTitle>{title}</PageTitle>
        {hasRequirements && !isLoading && (
          <Link
            passHref
            href={
              isBankNeeded
                ? routes.SELLER_DASHBOARD.BANK_ACCOUNT
                : routes.SELLER_DASHBOARD.ONBOARDING.REFRESH
            }
            legacyBehavior
          >
            <Tooltip title={verifyAccountTitle} describeChild>
              <div>
                <ContainedButton className="min-w-auto">
                  Verify Your account
                </ContainedButton>
              </div>
            </Tooltip>
          </Link>
        )}
      </div>
      <Grid container columnSpacing="35px">
        <Grid
          item
          md={2.2}
          lg={2}
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Sidebar>
            <StoreLogoHolder>
              <Image
                src={logo ? logo : frame}
                width={100}
                height={100}
                alt={`${profile?.store?.name ?? 'Unknown'} logo`}
                className="object-cover"
                priority
              />
            </StoreLogoHolder>
            <StoreName
              name={profile?.store?.name ?? ''}
              slug={profile?.store?.slug || null}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '24px',
                mb: 2,
              }}
              component="h3"
            >
              Account Settings
            </Typography>
            <SideNavigationLinks items={SIDEBAR_ITEMS} />
          </Sidebar>
        </Grid>
        <Grid item xs={12} md={9.8} lg={10}>
          <div className="px-4 py-0">{children}</div>
        </Grid>
      </Grid>
    </CustomContainer>
  );
};
