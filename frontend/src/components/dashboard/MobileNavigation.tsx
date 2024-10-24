import { ReactNode } from 'react';
import { Box, Divider, Typography, ButtonBase } from '@mui/material';
import { CaretRight, SignOut } from '@phosphor-icons/react';
import Link from 'next/link';
import routes from '@/constants/routes';

interface Item {
  label: string;
  value: string | (() => void);
  icon?: ReactNode;
  color?: string;
}

interface MobileNavigationProps {
  items: Item[];
}

const MobileLink = ({ label, value, icon, color = 'text.primary' }: Item) => {
  const isFunction = typeof value === 'function';

  const renderChild = () => (
    <Box
      component={isFunction ? ButtonBase : 'a'}
      key={label}
      sx={{
        display: 'flex',
        textDecoration: 'none',
        flexDirection: 'column',
        gap: '15px 0px',
        textAlign: 'left',
      }}
      onClick={isFunction ? () => value() : undefined}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: color,
          width: '100%',
        }}
      >
        <Typography
          sx={{
            flexGrow: 2,
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '18px',
          }}
          component="span"
        >
          {label}
        </Typography>
        {icon ? icon : <CaretRight size={16} weight="light" />}
      </Box>
      <Divider />
    </Box>
  );

  return isFunction ? (
    <>{renderChild()}</>
  ) : (
    <Link href={value} legacyBehavior passHref>
      {renderChild()}
    </Link>
  );
};

const MobileNavigation = ({ items }: MobileNavigationProps): JSX.Element => {
  return (
    <Box
      component="nav"
      sx={{
        // Selects all the items except the first one
        '& > *:nth-of-type(n+2)': {
          paddingTop: '15px',
        },
      }}
    >
      {items.map((item) => (
        <MobileLink
          label={item.label}
          value={item.value}
          key={`${item.value}-mobile`}
        />
      ))}
      <MobileLink
        label="Sign out"
        value={() => {
          window.location.href = routes.LOGOUT.INDEX;
        }}
        color="error.main"
        icon={<SignOut size={18} weight="light" />}
      />
    </Box>
  );
};

export default MobileNavigation;
