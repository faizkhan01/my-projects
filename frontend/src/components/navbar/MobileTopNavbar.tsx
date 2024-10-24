import dynamic from 'next/dynamic';
import Link from 'next/link';
import NavUserBtn from './NavUserBtn';
import { styled } from '@mui/material/styles';
import { useState, memo, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Toolbar,
  Drawer,
} from '@mui/material';
import {
  MagnifyingGlass,
  CaretRight,
  ArrowCounterClockwise,
  UserPlus,
  Percent,
  ChatCircle,
  List as ListIcon,
  UserCirclePlus,
  UserCircle,
  ClipboardText,
} from '@phosphor-icons/react';
import { ButtonWithIcon } from '@/ui-kit/buttons';
import { CustomContainer } from '@/ui-kit/containers';
import routes from '@/constants/routes';
import { useDrawerToggle } from '@/hooks/useDrawer';
import { DrawerPositioning } from '@/types/drawerPositioning';
import NavWishBtn from './NavWishBtn';
import NavCartBtn from './NavCartBtn';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import useCategories from '@/hooks/queries/useCategories';
import SubcategoryDrawer from '../drawers/SubcategoryDrawer';
import { Category } from '@/types/categories';
import { arrayToTree } from 'performant-array-to-tree';
import useProfile from '@/hooks/queries/useProfile';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/icons/Logo';
import { LoadingBackdrop } from '@/ui-kit/backdrops';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import CurrencySelector from '../currencySelector/CurrencySelector';

const SupportRequestModal = dynamic(
  () => import('@/components/modals/SupportRequestModal'),
);

const SearchDialog = dynamic(() => import('./SearchDialog'), {
  loading: () => <LoadingBackdrop open={true} />,
});

const StyledBox = styled('div')(({ theme }) => ({
  height: '100%',
  padding: '12px 0',
  backgroundColor: theme.palette.grey[50],
}));

const StyledFlexBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const LISTITEM_STYLES = {
  '& .MuiTypography-root': {
    color: '#333E5C',
    fontSize: '16px',
    lineHeight: '18px',
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const LISTITEM_WITH_ICON_STYLES = {
  '& .MuiTypography-root': {
    color: '#333E5C',
    fontSize: '16px',
    display: 'flex',
  },
  '& .MuiListItemText-primary': {
    marginRight: '10px',
  },
  display: 'flex',
  alignItems: 'center',
};

const DrawerList = memo(() => {
  const { profile } = useProfile();
  const [isSupportModal, setIsSupportModal] = useState(false);
  const MENU_LINKS_WITH_ICON: {
    text: string;
    href?: string;
    onClick?: () => void;
    icon: JSX.Element;
  }[] = useMemo(
    () => [
      {
        text: profile ? 'Go to Dashboard' : 'Join',
        ...(profile
          ? {
              href: routes.DASHBOARD.INDEX,
              icon: <UserCircle size={24} color="#5F59FF" weight="light" />,
            }
          : {
              onClick: () => useAuthModalStore.getState().open('register'),
              icon: <UserCirclePlus size={24} color="#5F59FF" weight="light" />,
            }),
      },
      {
        text: 'Recently Viewed Items',
        icon: <ArrowCounterClockwise size={24} color="#5F59FF" weight="fill" />,
        href: routes.RECENTLY_VIEWED.INDEX,
      },
      {
        text: 'Blog',
        icon: <ClipboardText size={25} color="#5F59FF" weight="light" />,
        href: routes.BLOG.INDEX,
      },

      {
        text: 'Become a Seller',
        icon: <UserPlus size={24} color="#5F59FF" weight="light" />,
        href: routes.SELL.INDEX,
      },
      {
        text: 'Promotions',
        icon: <Percent size={24} color="#5F59FF" weight="light" />,
      },
      {
        text: 'Help',
        icon: <ChatCircle size={24} color="#5F59FF" weight="light" />,
        onClick: () => {
          if (!profile) {
            useAuthModalStore.getState().open('login');
            return;
          }
          setIsSupportModal(true);
        },
      },
    ],
    [profile, setIsSupportModal],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Category['id'] | null
  >(null);
  const { categories: dataCategories = [] } = useCategories();

  const categories = useMemo(
    () => arrayToTree(dataCategories, { dataField: null }),
    [dataCategories],
  );

  const selectedCategory = useMemo(
    () =>
      selectedCategoryId
        ? categories?.find((category) => category.id === selectedCategoryId)
        : undefined,
    [categories, selectedCategoryId],
  );

  useNavigationEvent(() => {
    setSelectedCategoryId(null);
  });

  return (
    <>
      {Boolean(categories?.length) && (
        <SubcategoryDrawer
          isOpen={selectedCategoryId !== null}
          subcategories={selectedCategory?.children || []}
          onClose={() => setSelectedCategoryId(null)}
        />
      )}
      <List sx={{ pb: 0 }}>
        {categories.map((category) => (
          <ListItem key={category.name} disablePadding>
            <ListItemButton onClick={() => setSelectedCategoryId(category.id)}>
              <ListItemText
                sx={LISTITEM_STYLES}
                primary={category.name}
                secondary={
                  <CaretRight size={16} color="#96A2C1" weight="light" />
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ marginBlock: '16px' }} variant="middle" />
        {MENU_LINKS_WITH_ICON.map((text) => (
          <ListItem key={text.text} disablePadding>
            <ListItemButton
              onClick={() => text?.onClick?.()}
              component={text?.href ? Link : ListItemButton}
              href={text?.href}
            >
              <ListItemText
                sx={LISTITEM_WITH_ICON_STYLES}
                secondary={text.text}
                primary={text.icon}
              />
            </ListItemButton>
            <SupportRequestModal
              open={isSupportModal}
              onClose={() => setIsSupportModal(false)}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
});

DrawerList.displayName = 'DrawerList';

const MobileTopNavBar = (): JSX.Element => {
  const router = useRouter();
  const { toggleDrawer, drawerAnchor } = useDrawerToggle();
  const [isFirstOpenSearch, setIsFirstOpenSearch] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const onSearch = (value: string) => {
    router.push(
      routes.SEARCH.INDEX({
        q: value,
      }),
    );
    onCloseSearch();
  };

  const onCloseSearch = () => setOpenSearch(false);

  useNavigationEvent(() => {
    toggleDrawer(
      'left',
      false,
    )(null as unknown as React.MouseEvent<HTMLButtonElement>);
  });

  return (
    <StyledBox>
      {isFirstOpenSearch && (
        <SearchDialog
          open={openSearch}
          onClose={onCloseSearch}
          onSearch={onSearch}
        />
      )}
      <CustomContainer>
        <StyledFlexBox>
          <StyledFlexBox>
            <ButtonWithIcon
              onClick={toggleDrawer('left', !drawerAnchor.left)}
              icon={<ListIcon size={24} aria-label="Toggle drawer" />}
            />
            <ButtonWithIcon
              icon={<MagnifyingGlass size={24} aria-label="Search products" />}
              onClick={() => {
                setIsFirstOpenSearch(true);
                setOpenSearch(true);
              }}
            />
          </StyledFlexBox>
          <a
            href={routes.INDEX}
            aria-label="Go Home"
            className="flex items-center"
          >
            <Logo height={18} width={108} />
          </a>
          <StyledFlexBox className="gap-[14px]">
            <NavUserBtn variant="mobile" />
            <NavWishBtn variant="mobile" />
            <NavCartBtn variant="mobile" />
          </StyledFlexBox>
        </StyledFlexBox>
      </CustomContainer>

      <Drawer
        sx={{
          '& .MuiPaper-root ': {
            width: '100%',
          },
        }}
        elevation={0}
        anchor="left"
        open={drawerAnchor.left}
        onClose={toggleDrawer(DrawerPositioning.LEFT, false)}
        hideBackdrop
      >
        <Toolbar />
        <DrawerList />
        <div className="mb-4">
          <CurrencySelector className="px-4 py-2" />
        </div>
      </Drawer>
    </StyledBox>
  );
};

export default MobileTopNavBar;
