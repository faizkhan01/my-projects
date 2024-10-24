'use client';
import { Box, Typography, Button, Grid } from '@mui/material';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import ReasonOfRefundModal, {
  ReturnProductForm,
} from '@/components/modals/ReasonOfRefundModal';
import { styled } from '@mui/system';
import { ContainedButton, BackLinkButton } from '@/ui-kit/buttons';
import useRefundReasons from '@/hooks/queries/useRefundReasons';
import { createRefundAndReturn } from '@/services/API/refunds';
import { handleAxiosError } from '@/lib/axios';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import { MobileHeading } from '@/ui-kit/typography';
import { useRouter } from 'next/navigation';
import routes from '@/constants/routes';
import { OrderItemWithOrder } from '@/types/orders';
import { formatPrice } from '@/utils/currency';

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  fontSize: '18px',
  lineText: '21.6px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    marginBottom: '12px',
  },
}));

const MainText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '24px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const ProductText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  width: '258px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    width: '172px',
    height: '34px',
  },
}));

const ReturnModalButton = styled(Button)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  padding: '0px',
  color: theme.palette.primary.main,
  textAlign: 'left',

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));

const FlexBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  margin: '24px 0px',
  borderRadius: '10px',
  filter:
    'drop-shadow(0px 4px 53px rgba(0, 0, 0, 0.04)) drop-shadow(0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02))',
  border: `1px solid ${theme.palette.grey[400]}`,

  [theme.breakpoints.down('sm')]: {
    margin: '16px 0px',
    padding: '20px',
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  minHeight: '96px',
  minWidth: '96px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: theme.palette.grey[50],

  [theme.breakpoints.down('sm')]: {
    minWidth: '80px',
    minHeight: '80px',
  },
}));

const CreateRefundAndReturn = ({
  orderItem,
}: {
  orderItem: OrderItemWithOrder;
}) => {
  const oderCurency = orderItem?.order?.paymentCurrency;

  const [isReturnModalButton, setIsReturnModalButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState<ReturnProductForm | null>(null);
  const { refundReasons = [] } = useRefundReasons();
  const { push } = useRouter();

  const selectedReason = useMemo(() => {
    if (reason) {
      const re = refundReasons.find((it) => it.id === reason.reasonId);
      return re;
    }
  }, [reason, refundReasons]);

  const openSnackbar = useGlobalSnackbar((state) => state.open);

  const handleSubmit = async () => {
    if (!reason) return;

    const { description, reasonId, images } = reason;
    if (!description || !reasonId || !images) {
      return;
    }

    setIsLoading(true);

    const data = {
      description,
      reasonId,
      images: images as File[],
      orderItemId: orderItem.id,
    };

    try {
      await createRefundAndReturn(data);

      openSnackbar({
        severity: 'success',
        message: 'Refund Issue Created Successfully',
      });

      push(routes.DASHBOARD.MY_ORDERS);
    } catch (e) {
      handleAxiosError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Refund and return" />
      <Box>
        <MainText>List of products</MainText>
        {orderItem && (
          <StyledBox>
            <Grid container spacing={{ xs: '10px', sm: '16px' }}>
              {!!orderItem.product.images.length && (
                <Grid item xs="auto">
                  <ProductImageContainer>
                    <Image
                      src={orderItem.product.images?.[0]?.url}
                      alt="product_image"
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </ProductImageContainer>
                </Grid>
              )}
              <Grid container item xs>
                <Grid item xs={12} sm>
                  <ProductText>{orderItem.product.name}</ProductText>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                    }}
                  >
                    <PriceText>
                      {`${formatPrice(orderItem.unitPrice, {
                        currency: oderCurency,
                      })} x ${orderItem.quantity}`}
                    </PriceText>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 'auto' }}>
                  <ReturnModalButton
                    onClick={() => setIsReturnModalButton(true)}
                  >
                    {reason && selectedReason
                      ? `Reason for return: ${selectedReason.name}`
                      : 'Select the reason for return'}
                  </ReturnModalButton>
                </Grid>
              </Grid>
            </Grid>
          </StyledBox>
        )}
        <Box
          sx={{
            mb: '32px',
            display: reason && selectedReason ? 'block' : 'none',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '24px',
            }}
          >
            Return Policy
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '25.6px',
            }}
          >
            You will be able to ship the goods yourself or with a courier.
            <br /> After reviewing your application, we will send you detailed
            instructions
          </Typography>
        </Box>
        <FlexBox>
          <MainText>
            Refundable Amount:{' '}
            {formatPrice(orderItem.totalPrice, { currency: oderCurency })}
          </MainText>
          <ContainedButton
            className="mb-[60px] h-12 w-[200px] md:mb-0"
            size="large"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!reason}
          >
            Issue a refund
          </ContainedButton>
        </FlexBox>
      </Box>
      <ReasonOfRefundModal
        open={isReturnModalButton}
        onClose={(data) => {
          setReason(data);
          setIsReturnModalButton(false);
        }}
        item={{
          id: orderItem.id,
          name: orderItem.product.name,
          image: orderItem.product?.images?.length
            ? orderItem.product.images?.[0]?.url
            : '',
        }}
      />
    </Box>
  );
};

export default CreateRefundAndReturn;
