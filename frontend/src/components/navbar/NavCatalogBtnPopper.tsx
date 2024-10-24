import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { Popper } from '@/ui-kit/tooltips';
import { CustomContainer } from '@/ui-kit/containers';
import {
  ArrowCounterClockwise,
  UserPlus,
  Percent,
  ChatCircle,
  ClipboardText,
} from '@phosphor-icons/react';
import { FlameIcon } from '@/assets/icons/FlameIcon';
import type { Category } from '@/types/categories';
import useCategories from '@/hooks/queries/useCategories';
import { arrayToTree } from 'performant-array-to-tree';
import Link from 'next/link';
import routes from '@/constants/routes';
import { memo, useMemo, useState, useEffect } from 'react';
import usePopper from '@/hooks/usePopper';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import useProfile from '@/hooks/queries/useProfile';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import dynamic from 'next/dynamic';

const SupportRequestModal = dynamic(
  () => import('@/components/modals/SupportRequestModal'),
);

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
const MENUHEADING_STYLES = {
  '& .MuiTypography-root': {
    color: '#333E5C',
    fontSize: '16px',
    lineHeight: '18px',
    fontWeight: '600',
  },
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

const LinkWithIcons = memo(() => {
  const { profile } = useProfile();
  const [openSupport, setOpenSupport] = useState(false);

  const MENU_LINKS_WITH_ICON = useMemo(
    () => [
      {
        link: 'Sale',
        icon: <FlameIcon />,
      },
      {
        link: 'Recently Viewed Items',
        icon: <ArrowCounterClockwise size={25} color="#5F59FF" weight="fill" />,
        url: routes.RECENTLY_VIEWED.INDEX,
      },
      {
        link: 'Become a Seller',
        icon: <UserPlus size={25} color="#5F59FF" weight="light" />,
        url: routes.SELL.INDEX,
      },
      {
        link: 'Blog',
        icon: <ClipboardText size={25} color="#5F59FF" weight="light" />,
        url: routes.BLOG.INDEX,
      },
      {
        link: 'Promotions',
        icon: <Percent size={25} color="#5F59FF" weight="light" />,
      },
      {
        link: 'Help',
        icon: <ChatCircle size={25} color="#5F59FF" weight="light" />,
        onClick: () => {
          if (!profile) {
            useAuthModalStore.getState().open('login');
            return;
          }

          setOpenSupport(true);
        },
      },
    ],
    [profile],
  );

  return (
    <>
      <SupportRequestModal
        open={openSupport}
        onClose={() => setOpenSupport(false)}
      />
      {MENU_LINKS_WITH_ICON.map((text) => (
        <ListItem key={text.link} disablePadding>
          <ListItemButton
            component={text?.url ? Link : 'button'}
            href={text?.url ?? undefined}
            onClick={text?.onClick}
          >
            <ListItemText
              sx={LISTITEM_WITH_ICON_STYLES}
              secondary={text.link}
              primary={text.icon}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
});

LinkWithIcons.displayName = 'LinkWithIcons';

const NavCatalogBtnPopper = ({
  id: popperId,
  anchorEl,
  open: isOpenPopper,
  handleClickAway,
  handleClose,
}: Pick<
  ReturnType<typeof usePopper>,
  'anchorEl' | 'open' | 'id' | 'handleClickAway' | 'handleClose'
>) => {
  const { categories = [], error } = useCategories();
  /* const { events } = useRouter(); */
  const [activeCatalog, setActiveCatalog] = useState<Category['id'] | null>(
    null,
  );

  const handleHover = (id: number) => {
    setActiveCatalog(id);
  };

  const catalog = useMemo(
    () => (error ? [] : arrayToTree(categories, { dataField: null })),
    [error, categories],
  );

  const subCatalog = useMemo(
    () => catalog?.find((item) => item.id === activeCatalog)?.children,
    [catalog, activeCatalog],
  );

  useEffect(() => {
    if (!activeCatalog && categories?.length) {
      setActiveCatalog(categories[0].id);
    }
  }, [categories, activeCatalog]);

  useNavigationEvent(() => {
    handleClose();
  });

  return (
    <Popper
      anchorEl={anchorEl}
      id={popperId}
      open={isOpenPopper}
      disablePortal
      sx={{
        width: '100%',
        zIndex: '100',
        height: '714px',

        '& > div': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          padding: '0',
        },
      }}
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
      <CustomContainer>
        <div className="grid grid-cols-[270px_1fr] bg-white">
          <List
            sx={{
              background: '#F6F9FF',
              overflowY: 'scroll',
              height: '714px',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track ': {
                backgroundColor: '#fff',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#96A2C1',
                borderRadius: '20px',
              },
            }}
          >
            {catalog?.map((text) => (
              <ListItem key={text.id} disablePadding>
                <ListItemButton
                  onMouseEnter={() => handleHover(text.id)}
                  sx={{
                    '&:hover': {
                      background: '#FCFDFF',
                    },
                    background:
                      activeCatalog === text.id ? '#FCFDFF' : undefined,
                  }}
                >
                  <ListItemText sx={LISTITEM_STYLES} primary={text.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ marginBlock: '16px' }} variant="middle" />
            <LinkWithIcons />
          </List>
          <div className="flex h-[714px] w-full flex-col flex-wrap overflow-y-scroll p-4">
            {subCatalog?.map((link: Category) => (
              <List key={link.id} sx={{ paddingTop: '0' }}>
                <ListItem
                  sx={{
                    paddingTop: '0',
                  }}
                >
                  <ListItemText
                    sx={MENUHEADING_STYLES}
                    primary={
                      <MuiLink
                        component={Link}
                        href={routes.CATEGORIES.INFO(link.name)}
                        underline="hover"
                      >
                        {link.name}
                      </MuiLink>
                    }
                  />
                </ListItem>
                {link.children.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      padding: '0',
                      color: 'text.primary',
                    }}
                  >
                    <Link
                      href={routes.CATEGORIES.INFO(item.name)}
                      passHref
                      legacyBehavior
                    >
                      <ListItemButton>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            ))}
          </div>
        </div>
      </CustomContainer>
    </Popper>
  );
};

export default NavCatalogBtnPopper;
