import dynamic from 'next/dynamic';
import useMenu from '@/hooks/useMenu';
import { usePathname } from 'next/navigation';
import routes from '@/constants/routes';
import { MenuItem } from '@/ui-kit/menu';
import usePopper from '@/hooks/usePopper';
import { Typography } from '@mui/material';
import { User } from '@phosphor-icons/react';
import { USER_ROLES } from '@/constants/auth';
import { type MenuProps } from '@/ui-kit/menu';
import { SignOut } from '@phosphor-icons/react';
import { useId, useMemo } from 'react';
import useProfile from '@/hooks/queries/useProfile';
import { useChats } from '@/hooks/queries/useChats';
import { Badge, Skeleton } from '@mui/material';
import { type PopperProps } from '@/ui-kit/tooltips';
import { styled, useTheme } from '@mui/material/styles';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import {
  ButtonWithIcon,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';

interface NavUserBtnProps {
  variant?: 'default' | 'mobile';
}

const Popper = dynamic<PopperProps>(() =>
  import('@/ui-kit/tooltips').then((mod) => mod.Popper),
);

const Menu = dynamic<MenuProps>(() =>
  import('@/ui-kit/menu').then((mod) => mod.Menu),
);

const StyledCounter = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.secondary.main,
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
}));

const ICON_BUTTON_STYLES = {
  padding: 0,
  color: 'text.primary',
  '& p': {
    color: 'text.primary',
  },
  '&:hover': {
    transition: '0.4s',
    color: 'primary.main',
    backgroundColor: 'transparent',
    '& p': {
      transition: '0.4s',
      color: 'primary.main',
    },
  },
};

const NavUserBtn = ({ variant = 'default' }: NavUserBtnProps) => {
  const id = useId();
  const {
    handleClick,
    handleClickAway,
    open: isOpenPopper,
    id: popperId,
    anchorEl,
    handleClose,
  } = usePopper(`${id}-navbar-popper`);

  const {
    handleClick: handleClickMenu,
    handleClose: handleCloseMenu,
    open: openMenu,
    anchorEl: anchorElMenu,
    menuId,
    buttonId,
  } = useMenu();

  const open = useAuthModalStore((state) => state.open);

  const theme = useTheme();
  const { profile, isLoading, isLoggedIn } = useProfile();
  const { data } = useChats();

  const unreadMessages = useMemo(
    () => data?.unreadCount ?? 0,
    [data?.unreadCount],
  );
  const pathname = usePathname();
  const isInDashboard = pathname.includes(routes.DASHBOARD.INDEX);
  const isMobile = variant === 'mobile';

  useNavigationEvent(() => {
    handleClose();
    handleCloseMenu();
  });

  return (
    <div>
      {isLoading ? (
        <Skeleton
          variant="rounded"
          height={isMobile ? 24 : 42}
          width={isMobile ? 24 : 28}
        />
      ) : (
        <Badge
          badgeContent={unreadMessages + (profile?.notificationsCount ?? 0)}
          color="error"
        >
          <ButtonWithIcon
            aria-describedby={!isLoggedIn ? popperId : undefined}
            aria-controls={isLoggedIn && openMenu ? menuId : undefined}
            aria-haspopup={menuId ? 'true' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-label={isMobile ? 'User Menu' : undefined}
            title={isMobile ? '' : profile?.firstName ?? 'Join'}
            id={buttonId}
            icon={
              isInDashboard ? (
                <User
                  size={isMobile ? 24 : 28}
                  weight="fill"
                  color={theme.palette.primary.main}
                />
              ) : (
                <User size={isMobile ? 24 : 28} />
              )
            }
            sx={
              isInDashboard || isMobile
                ? {
                    ...ICON_BUTTON_STYLES,
                    color: 'primary.main',
                    '& p': {
                      color: 'primary.main',
                    },
                  }
                : ICON_BUTTON_STYLES
            }
            onClick={!isLoggedIn ? handleClick : handleClickMenu}
          />
        </Badge>
      )}

      {isLoggedIn && !isLoading && (
        <Menu
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}
          id={menuId}
          MenuListProps={{
            'aria-labelledby': buttonId,
          }}
          transformOrigin={{
            vertical: -16,
            horizontal: 80,
          }}
        >
          <MenuItem divider href={routes.DASHBOARD.INDEX}>
            Account
          </MenuItem>
          <MenuItem
            divider
            href={
              profile?.role === USER_ROLES.SELLER
                ? routes.SELLER_DASHBOARD.ORDERS.LIST
                : routes.DASHBOARD.MY_ORDERS
            }
          >
            My Orders
          </MenuItem>
          {profile?.role === USER_ROLES.USER && (
            <div>
              <MenuItem
                divider
                href={
                  isMobile
                    ? routes.DASHBOARD.FOLLOWING
                    : `${routes.DASHBOARD.INDEX}#following`
                }
              >
                My Favorite Store
              </MenuItem>
            </div>
          )}
          <MenuItem divider href={routes.DASHBOARD.NOTIFICATIONS}>
            Notification
            {!!profile?.notificationsCount && (
              <StyledCounter>{profile?.notificationsCount}</StyledCounter>
            )}
          </MenuItem>
          <MenuItem divider href={routes.DASHBOARD.MESSAGES.LIST}>
            Message Center
            {!!unreadMessages && (
              <StyledCounter>{unreadMessages}</StyledCounter>
            )}
          </MenuItem>
          <MenuItem
            className="text-error-main hover:text-error-dark"
            onClick={() => (window.location.href = routes.LOGOUT.INDEX)}
          >
            Sign Out <SignOut className="ml-2" size={18} />
          </MenuItem>
        </Menu>
      )}

      {!isLoggedIn && !isLoading && (
        <Popper
          anchorEl={anchorEl}
          id={popperId}
          open={isOpenPopper}
          onClickAway={handleClickAway}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 16],
              },
            },
          ]}
        >
          <div className="flex max-w-[250px] flex-col gap-4">
            Sign in to make purchases, track orders, and take advantage of
            personal discounts and points.
            <br /> <br />
            Once logged in, you&apos;ll be able to create a legal entity
            account.
            <OutlinedButton
              onClick={() => {
                handleClose();
                open('login');
              }}
            >
              Log In
            </OutlinedButton>
            <ContainedButton
              onClick={() => {
                handleClose();
                open('register');
              }}
            >
              Sign Up
            </ContainedButton>
          </div>
        </Popper>
      )}
    </div>
  );
};

export default NavUserBtn;
