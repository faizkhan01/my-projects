import useCart from '@/hooks/queries/customer/useCart';
import { useCartPrice } from '@/hooks/queries/customer/useCartPrice';
import { Box, Typography, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { useState } from 'react';
import CartViewBox from '../CartViewBox';
import { formatPrice } from '@/utils/currency';
import { Accordion } from '@/ui-kit/accordions';
import { useActualCurrency } from '@/hooks/stores/useUserPreferencesStore';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'none',
  borderRadius: '10px',
  marginBottom: '32px',
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px rgba(0, 0, 0, 0.02), 0px 4px 53px 0px rgba(0, 0, 0, 0.04)',

  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderRadius: '10px',
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px rgba(0, 0, 0, 0.02), 0px 4px 53px 0px rgba(0, 0, 0, 0.04)',

  [theme.breakpoints.down('md')]: {},
}));

export const MobileCartBox = ({ activeStep }: { activeStep: number }) => {
  const [value, setValue] = useState<'1' | string>('');

  const { cartArray } = useCart(true);
  const actualCurrency = useActualCurrency();

  const { data: cartPrice, isLoading: isLoadingCartPrice } = useCartPrice(
    cartArray ?? null,
    {
      currency: actualCurrency ?? undefined,
    },
  );

  const isLoadingPrice = isLoadingCartPrice;

  return (
    <Wrapper>
      <Accordion type="single" value={value} onValueChange={(v) => setValue(v)}>
        <Accordion.Item value="1">
          <Accordion.Summary className="p-6" disableExpandIcon>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-between">
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontSize: '18px',
                    fontWeight: '600',
                    lineHeight: '120%',
                  }}
                >
                  Order summary
                </Typography>
                <Box sx={{ marginLeft: '8px', color: 'primary.main' }}>
                  {value === '1' ? (
                    <CaretUp size={18} />
                  ) : (
                    <CaretDown size={18} />
                  )}
                </Box>
              </div>

              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {isLoadingPrice && <Skeleton width={100} height="100%" />}
                {!isLoadingPrice &&
                  formatPrice(cartPrice?.prices?.total ?? 0, {
                    currency: actualCurrency,
                  })}
              </Typography>
            </div>
          </Accordion.Summary>
          <Accordion.Details>
            <Box>
              <StyledBox
                sx={{
                  height: 'fit-content',
                  position: 'sticky',
                  top: 0,
                }}
              >
                <CartViewBox activeStep={activeStep} />
              </StyledBox>
            </Box>
          </Accordion.Details>
        </Accordion.Item>
      </Accordion>
    </Wrapper>
  );
};
