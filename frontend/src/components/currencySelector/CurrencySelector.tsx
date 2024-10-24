'use client';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { Check } from '@phosphor-icons/react';
import { Menu, MenuItem } from '@/ui-kit/menu';
import { Box, Button, Typography } from '@mui/material';
import USflag from '@/assets/images/USflag.png';
import CanadaFlag from '@/assets/images/CanadaFlag.png';
import useMenu from '@/hooks/useMenu';
import { useMemo } from 'react';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';
import { DOMAINS } from '@/constants/domains';
import { cn } from '@/ui-kit/utils';
import { usePathname } from 'next/navigation';

const StyledFlexBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ProductImageContainer = styled(Box)(() => ({
  height: '18px',
  width: '18px',
  overflow: 'hidden',
  position: 'relative',
}));

const CurrencyText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '18px',
  color: theme.palette.text.primary,
  marginLeft: '10px',
}));

const DROPDOWN_ITEMS = [
  {
    name: 'United States (USD)',
    icon: USflag.src,
    currency: 'USD',
    domain: DOMAINS.MAIN,
  },
  {
    name: 'Canada (CAD)',
    icon: CanadaFlag.src,
    currency: 'CAD',
    domain: DOMAINS.CANADA,
  },
];

const CurrencySelector = ({ className }: { className?: string }) => {
  const actualCurrency = useActualCurrency();
  const pathname = usePathname();
  const { open, handleClick, handleClose, menuAria, buttonAria, anchorEl } =
    useMenu();

  const selected = useMemo(() => {
    return DROPDOWN_ITEMS.find(
      (i) => i.currency.toUpperCase() === actualCurrency?.toUpperCase(),
    );
  }, [actualCurrency]);

  return (
    <>
      <Button
        onClick={handleClick}
        {...buttonAria}
        className={cn('w-full justify-start', className)}
      >
        {selected && (
          <>
            <ProductImageContainer>
              <Image
                src={selected.icon}
                alt={selected.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </ProductImageContainer>
            <CurrencyText
              sx={{
                color: selected ? 'text.primary' : 'text.secondary',
              }}
            >
              {selected.name}
            </CurrencyText>
          </>
        )}
      </Button>

      <Menu
        sx={{
          width: {
            md: '270px',
            xs: '100%',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: -4,
          horizontal: 0,
        }}
        {...menuAria}
      >
        {DROPDOWN_ITEMS.map(({ currency, name, icon, domain }) => {
          const isSelected = selected?.currency === currency;
          const href = new URL(domain);
          href.pathname = pathname;

          return (
            <MenuItem key={currency} divider href={href}>
              <ProductImageContainer>
                <Image
                  src={icon}
                  alt={name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </ProductImageContainer>
              <StyledFlexBox>
                <CurrencyText
                  sx={{
                    color: isSelected ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {name}
                </CurrencyText>
                {isSelected && <Check size={18} />}
              </StyledFlexBox>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
export default CurrencySelector;
