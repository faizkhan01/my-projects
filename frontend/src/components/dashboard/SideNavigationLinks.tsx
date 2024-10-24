import {
  Children,
  cloneElement,
  ReactNode,
  isValidElement,
  ReactElement,
  ComponentProps,
} from 'react';
import {
  Typography,
  Box,
  Collapse,
  List,
  Divider,
  Link,
  Theme,
  useMediaQuery,
} from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretRight } from '@phosphor-icons/react';
import { ConditionalWrapper } from '@/ui-kit/containers';

const ActiveStyles = {
  padding: '4px 16px',
  backgroundColor: '#DDDCFF',
  borderRadius: '2px',
  gap: '10px',
};

interface Item {
  label: string;
  value: string;
  disabled?: boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  counter?: number;
  children?: Omit<Item, 'icon'>[];
  exact?: boolean;
  color?: string;
  avoidNextLink?: boolean;
}

const CounterBox = ({ count }: { count: number }) => (
  <Box
    sx={{
      backgroundColor: 'error.main',
      width: '20px',
      height: '20px',
      color: 'common.white',
      borderRadius: '50%',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    component="span"
  >
    {count}
  </Box>
);

const NestedLink = ({
  item,
  active,
  pathname,
}: {
  item: Item;
  active: boolean;
  pathname: string;
}) => (
  <Collapse in={active} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      {item.children?.map((child, key) => {
        const active = item.exact
          ? pathname === item.value
          : pathname.includes(item.value);

        return (
          <NextLink href={child.value} passHref legacyBehavior key={key}>
            <Typography
              component="a"
              sx={{
                textDecoration: 'none',
                alignSelf: 'flex-start',
                color: active ? 'text.primary' : '#96A2C1',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '18px',
                display: 'flex',
                gap: '8px',
                margin: '16px 0 0 8px',
                position: 'relative',
                '&:hover': {
                  color: 'primary.main',
                },
                '&::before': {
                  content: '" "',
                  height: '8px',
                  width: '8px',
                  borderRadius: '90px',
                  backgroundColor: 'primary.main',
                  marginBlock: 'auto',
                  display: active ? 'block' : 'none',
                },
              }}
            >
              {child.label}
            </Typography>
          </NextLink>
        );
      })}
    </List>
  </Collapse>
);
export const SideLink = ({
  item,
  showMobile,
  onlyMobile = false,
}: {
  item: Item;
  showMobile?: boolean;
  onlyMobile?: boolean;
}) => {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.value
    : pathname.includes(item.value);

  return showMobile ? (
    <ConditionalWrapper
      condition={!item.disabled}
      wrapper={(children) => {
        return (
          <Link
            sx={{
              display: 'flex',
              textDecoration: 'none',
              flexDirection: 'column',
              gap: '15px 0px',
              textAlign: 'left',
            }}
            component={item.avoidNextLink ? 'a' : NextLink}
            href={item.value}
          >
            {children}
          </Link>
        );
      }}
      elseWrapper={(c) => {
        return (
          <Box
            sx={{
              display: 'flex',
              textDecoration: 'none',
              flexDirection: 'column',
              gap: '15px 0px',
              textAlign: 'left',
            }}
          >
            {c}
          </Box>
        );
      }}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            color: item.disabled
              ? 'text.secondary'
              : item.color || 'text.primary',
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              gap: '12px',
              flexGrow: 2,
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '18px',
            }}
            component="span"
          >
            {item?.leftIcon}
            {item.label}
            {item.counter && <CounterBox count={item.counter} />}
          </Typography>
          {item.rightIcon ? (
            item.rightIcon
          ) : (
            <CaretRight size={16} weight="light" />
          )}
        </Box>
        <Divider />
      </>
    </ConditionalWrapper>
  ) : (
    <Box
      sx={{
        ...(onlyMobile
          ? {
              display: {
                sm: 'none',
              },
            }
          : {}),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          component={item.disabled ? 'span' : NextLink}
          href={item.value}
          sx={{
            textDecoration: 'none',
            alignSelf: 'flex-start',
            color: item.disabled ? 'text.secondary' : 'text.primary',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
            display: 'flex',
            gap: '8px',

            '&:hover': {
              ...(!item.disabled && {
                color: 'primary.main',
              }),
            },

            ...(active && ActiveStyles),
          }}
        >
          {item?.leftIcon}
          {item.label}
        </Typography>

        {typeof item.counter !== 'undefined' && (
          <CounterBox count={item.counter as number} />
        )}
      </Box>
      {item.children && (
        <NestedLink item={item} active={active} pathname={pathname} />
      )}
    </Box>
  );
};

export const SideNavigationLinks = ({ items }: { items: ReactNode[] }) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      component="nav"
    >
      {Children.map<ReactNode, ReactNode>(items, (child) => {
        if (isValidElement(child)) {
          return cloneElement(
            child as ReactElement<ComponentProps<typeof SideLink>>,
            { showMobile: isMobile },
          );
        }
      })}
    </Box>
  );
};
