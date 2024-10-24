import { useMemo } from 'react';
import { ClockCounterClockwise, Heart, UserList } from '@phosphor-icons/react';
import routes from '@/constants/routes';
import Link from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ConditionalWrapper } from '@/ui-kit/containers';

interface CardItemProps {
  children: JSX.Element;
  label: string;
  url?: string;
  onClick?: () => void;
  selected?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.palette.grey[400]}`,
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px #00000005,0px 4px 53px 0px #0000000A',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    borderRadius: '6px',
    border: 0,
  },
}));

const CardItem = ({
  children,
  label,
  url,
  onClick,
  selected = false,
}: CardItemProps) => (
  <StyledCard
    sx={{
      ...(selected && {
        borderColor: 'primary.main',
      }),
    }}
  >
    <ConditionalWrapper
      condition={Boolean(onClick)}
      wrapper={(children) => <Box onClick={onClick}>{children}</Box>}
      elseWrapper={(children) => (
        <Link href={url ?? '#'} passHref legacyBehavior>
          {children}
        </Link>
      )}
    >
      <CardActionArea
        sx={{
          width: { xs: '104px', md: '270px' },
          height: { xs: '87px', md: '124px' },
        }}
      >
        <CardContent
          sx={{
            pt: '24px',
            pb: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {children}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: '14px', md: '18px' },
                lineHeight: '24px',
              }}
            >
              {label}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </ConditionalWrapper>
  </StyledCard>
);

interface OverviewCardsProps {
  iconSize?: 'small' | 'medium';
  selected?: { wishlist?: boolean; viewed?: boolean; following?: boolean };
  onClickFollowing: () => void;
}

export const OverviewCards = ({
  iconSize = 'medium',
  onClickFollowing,
  selected,
}: OverviewCardsProps) => {
  const size = iconSize === 'small' ? 24 : 44;

  const CARD_ITEMS = useMemo(
    () => [
      {
        url: routes.WISHLIST.INDEX,
        label: 'Wishlist',
        icon: <Heart weight="light" size={size} />,
        selected: selected?.wishlist,
      },
      {
        url: routes.INDEX,
        label: 'Following',
        onClick: onClickFollowing,
        icon: <UserList weight="light" size={size} />,
        selected: selected?.following,
      },
      {
        url: routes.RECENTLY_VIEWED.INDEX,
        label: 'Viewed',
        icon: <ClockCounterClockwise weight="light" size={size} />,
        selected: selected?.viewed,
      },
    ],
    [
      onClickFollowing,
      selected?.following,
      selected?.viewed,
      selected?.wishlist,
      size,
    ],
  );

  return (
    <Box
      sx={{
        mt: { xs: 0, md: 4 },
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', md: 'flex-start' },
        gap: { xs: '16px 16px', md: '30px 30px' },
      }}
    >
      {CARD_ITEMS.map((item) => (
        <Box key={item.label}>
          <CardItem
            label={item.label}
            url={item.url}
            onClick={item.onClick}
            selected={item.selected}
          >
            {item.icon}
          </CardItem>
        </Box>
      ))}
    </Box>
  );
};
