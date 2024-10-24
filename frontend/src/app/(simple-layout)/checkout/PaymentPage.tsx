import { useMemo, useCallback } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormContext, useWatch } from 'react-hook-form';
import { CaretLeft } from '@phosphor-icons/react';
import { ContainedButton } from '@/ui-kit/buttons';
import { BillingAddressSelector } from './components/AddressSelector';
import { CheckoutForm } from './form';
import { formatAddress } from '@/utils/formatters';
import useCountries from '@/hooks/queries/useCountries';
import useCountryStates from '@/hooks/queries/useCountryStates';
import useProfile from '@/hooks/queries/useProfile';
import { flushSync } from 'react-dom';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import { AddressFormData } from '@/types/address';
import useAddresses from '@/hooks/queries/useAddresses';
import { ADDRESS_TYPES_ENUM } from '@/types/address';
import { useCartDeliveryTime } from '@/hooks/queries/customer/useCartDeliveryTime';
import useCart from '@/hooks/queries/customer/useCart';

const ShadowBox = styled(Box)(() => ({
  padding: '16px 24px',
  borderRadius: '10px',
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px rgba(0, 0, 0, 0.02), 0px 4px 53px 0px rgba(0, 0, 0, 0.04)',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  lineHeight: '22px',
  color: theme.palette.text.primary,
}));

const SecondaryText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 100,
  lineHeight: '14px',
  color: theme.palette.text.secondary,
}));

const LightText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 100,
  lineHeight: '14px',
  color: theme.palette.text.primary,
}));

const EditButton = styled(Button)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '14px',
  color: theme.palette.primary.main,
}));

const ButtonLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '40px',
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    flexDirection: 'column-reverse',
  },
}));

interface PaymentPageProps {
  handleBack: () => void;
  shippingCountryIso2?: string;
}

const PaymentPage = ({ handleBack, shippingCountryIso2 }: PaymentPageProps) => {
  const { profile } = useProfile();

  const {
    setFocus,
    control,
    formState: { isSubmitting },
  } = useFormContext<CheckoutForm>();
  const { addresses: shippingAddresses } = useAddresses(
    ADDRESS_TYPES_ENUM.SHIPPING,
    Boolean(profile),
  );
  const { cartArray } = useCart(true);

  const [userData, savedShipping, guestEmail] = useWatch<
    CheckoutForm,
    ['shipping', 'savedShipping', 'guestEmail']
  >({
    name: ['shipping', 'savedShipping', 'guestEmail'],
    control,
  });

  const { data: deliveryTimes, isLoading: isLoadingDelivery } =
    useCartDeliveryTime(cartArray, shippingCountryIso2);

  const shippingData = useMemo<AddressFormData>(() => {
    if (savedShipping) {
      const address = shippingAddresses?.find(
        (address) => address?.id === savedShipping,
      );
      return {
        firstName: address?.firstName ?? '',
        lastName: address?.lastName ?? '',
        addressOne: address?.addressOne ?? '',
        addressTwo: address?.addressTwo ?? '',
        city: address?.city ?? '',
        state: address?.state?.id ?? -1,
        country: address?.country?.id ?? '',
        zipCode: address?.zipCode ?? '',
        email: null,
        phone: address?.phone ?? '',
        default: address?.default,
      } satisfies AddressFormData;
    }

    return userData;
  }, [savedShipping, shippingAddresses, userData]);

  const { countries } = useCountries();
  const { states } = useCountryStates(shippingData.country as number);

  const handleAddressChange = useCallback(() => {
    flushSync(() => {
      handleBack();
    });
    setFocus('shipping.addressOne', {
      shouldSelect: true,
    });
  }, [handleBack, setFocus]);

  const handleEmailChange = useCallback(() => {
    flushSync(() => {
      handleBack();
    });
    setFocus('guestEmail', {
      shouldSelect: true,
    });
  }, [handleBack, setFocus]);

  const shipToCountry = useMemo(() => {
    return countries?.find((country) => country.id === shippingData.country);
  }, [countries, shippingData.country]);

  const shipToState = useMemo(() => {
    return states?.find((state) => state.id === shippingData.state);
  }, [states, shippingData.state]);

  const formattedAddress = useMemo(() => {
    return formatAddress({
      addressOne: shippingData.addressOne,
      // addressTwo: shippingData.addressTwo,
      city: shippingData.city,
      state: shipToState?.name ?? '',
      country: shipToCountry?.name ?? '',
      zipCode: shippingData.zipCode,
    });
  }, [
    shipToCountry?.name,
    shipToState?.name,
    shippingData.addressOne,
    shippingData.city,
    shippingData.zipCode,
  ]);

  const isDisabledPayment = useMemo(() => {
    if (!cartArray?.length) {
      return true;
    }

    if (
      deliveryTimes?.some((d) => !d.canDeliver || d.deleted || d.outOfStock)
    ) {
      return true;
    }
  }, [cartArray?.length, deliveryTimes]);

  return (
    <div>
      <div className="flex flex-col gap-10">
        <ShadowBox className="grid grid-cols-[1fr_min-content] items-center gap-x-4 gap-y-1 sm:grid-cols-[min-content_1fr_min-content]">
          <SecondaryText>Contact</SecondaryText>
          <LightText className="row-start-2 sm:row-start-auto">
            {profile?.email ?? guestEmail}
          </LightText>
          {!profile && (
            <EditButton onClick={handleEmailChange}>Edit</EditButton>
          )}
          <Divider className="col-span-full my-4" />
          <SecondaryText>Ship to</SecondaryText>
          <LightText className="row-start-5 sm:row-start-auto">
            {formattedAddress}
          </LightText>
          <EditButton onClick={handleAddressChange}>Edit</EditButton>
        </ShadowBox>
        <div className="flex flex-col gap-4">
          <TitleText>Payment Method</TitleText>
          <PaymentMethodSelector />
        </div>
        <div className="flex flex-col gap-4">
          <TitleText>Billing Address</TitleText>
          <BillingAddressSelector />
        </div>
        {/* <Box */}
        {/*   sx={{ */}
        {/*     display: */}
        {/*       activeBillingAddress === 'shippingAddress' ? 'block' : 'none', */}
        {/*   }} */}
        {/* > */}
        {/*   <TitleText>Remember me</TitleText> */}
        {/*   <TitleText> */}
        {/*     <FormControlLabel */}
        {/*       sx={{ */}
        {/*         '&.MuiFormControlLabel-root': { */}
        {/*           marginLeft: '1px', */}
        {/*           marginTop: '16px', */}
        {/*         }, */}
        {/*       }} */}
        {/*       control={<Checkbox sx={{ marginRight: '8px' }} />} */}
        {/*       label="Save my information for a faster checkout" */}
        {/*     /> */}
        {/*   </TitleText> */}
        {/* </Box> */}
      </div>
      <ButtonLayout>
        <Button
          sx={{
            width: {
              xs: '100%',
              md: 'fit-content',
            },
            marginTop: {
              xs: '24px',
              md: '0',
            },
            height: '48px',
          }}
          startIcon={<CaretLeft size={16} color="#5F59FF" />}
          onClick={handleBack}
        >
          Back to shipping
        </Button>
        <ContainedButton
          className="h-12 md:w-[160px]"
          type="submit"
          loading={isSubmitting || isLoadingDelivery}
          disabled={isDisabledPayment}
        >
          Pay Now
        </ContainedButton>
      </ButtonLayout>
    </div>
  );
};

export default PaymentPage;
