'use client';
import { CustomContainer } from '@/ui-kit/containers';
import { Box } from '@mui/system';
import { useCallback, useState, useEffect, useMemo } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import InformationPage from './InformationPage';
import PaymentPage from './PaymentPage';
import { styled } from '@mui/material/styles';
import CartViewBox from './CartViewBox';
import { StepIconProps, Theme, useMediaQuery } from '@mui/material';
import { Check } from '@phosphor-icons/react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { emailSchema, postalCodeSchema } from '@/utils/yupValidations';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MobileCartBox } from './components/MobileCartBox';
import useProfile from '@/hooks/queries/useProfile';
import { useConfirmUnload } from '@/hooks/useConfirmUnload';
import useAddresses from '@/hooks/queries/useAddresses';
import { ADDRESS_TYPES_ENUM, AddressFormData } from '@/types/address';
import useCart from '@/hooks/queries/customer/useCart';
import routes from '@/constants/routes';
import { Cache, State, useSWRConfig } from 'swr';
import {
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { ADDRESSES_CRUD_TYPES, COUNTRIES } from '@/constants/api';
import useCountries from '@/hooks/queries/useCountries';
import useCountryStates from '@/hooks/queries/useCountryStates';
import {
  ConfirmCheckoutProps,
  ConfirmCheckoutResponse,
  confirmCheckout,
  createSetupIntent,
} from '@/services/API/checkout';
import { deleteCustomerCard } from '@/services/API/cards';
import { Cart } from '@/types/cart';
import { ProfileData } from '@/types/user';
import { handleAxiosError } from '@/lib/axios';
import OrderConfirmedModal, {
  OrderConfirmedModalProps,
} from '@/components/modals/OrderConfirmedModal';
import { useCartActions } from '@/hooks/cart/useCartActions';
import { ProductWithQuantity } from '@/types/products';
import { CheckoutForm } from './form';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';
import { getCountryFromList } from '@/utils/countries';
import { phoneSchema } from '@/utils/yupValidations/phoneSchema';
import { shallow } from 'zustand/shallow';

const FormLayout = styled('form')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 470px',
  gap: '130px',
  marginTop: '40px',

  [theme.breakpoints.down('lg')]: {
    gap: '60px',
  },

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const CartContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderRadius: '10px',
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px rgba(0, 0, 0, 0.02), 0px 4px 53px 0px rgba(0, 0, 0, 0.04)',
  height: 'fit-content',
  position: 'sticky',
  top: 0,
  display: 'block',

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StepIconComponent = ({ icon, active, completed }: StepIconProps) => {
  return (
    <div
      className={`flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-[14px] ${
        active
          ? 'bg-primary-main font-semibold text-white'
          : 'text-[#[ 6A2C1] border border-solid border-[#EAECF4] font-normal'
      }`}
    >
      {completed && <Check />}
      {!completed && icon}
    </div>
  );
};

const addressSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phone: phoneSchema,
  country: yup.lazy((v) =>
    typeof v === 'number'
      ? yup
          .number()
          .positive('Country is required')
          .required('Country is required')
      : yup.string().required('Country is required'),
  ),
  state: yup.lazy((v) =>
    typeof v === 'number'
      ? yup
          .number()
          .positive('Country is required')
          .required('Country is required')
      : yup.string().required('Country is required'),
  ),
  city: yup.string().required('City is required'),
  addressOne: yup.string().required('Address is required'),
  zipCode: postalCodeSchema.required('Zip code is required'),
});

const schema = yup
  .object({
    shipping: yup.mixed().when('savedShipping', {
      is: (value: CheckoutForm['savedShipping']) => !value,
      then: () => addressSchema,
    }),
    savedShipping: yup.number().integer().nullable(),
    billing: yup.mixed().when(['billingSameAsShipping', 'savedBilling'], {
      is: (
        billingSame: CheckoutForm['billingSameAsShipping'],
        savedBilling: CheckoutForm['savedBilling'],
      ) => !billingSame && !savedBilling,
      then: () => addressSchema,
    }),
    savedBilling: yup.number().integer().nullable(),
    billingSameAsShipping: yup.boolean().required(),
    guestEmail: yup.string().when('isGuest', {
      is: (value: CheckoutForm['isGuest']) => value,
      then: () => emailSchema,
    }),
    isGuest: yup.boolean().required(),

    // if paymentMethod is new_card (adding a new card), then it should fill the form with the holder name,
    // card number, expiry date and cvc
    card: yup.mixed().when('paymentMethod', {
      is: (value: CheckoutForm['paymentMethod']) => value === 'new_card',
      then: () => {
        return yup.object({
          holder: yup.string().required('The name is required'),
          // Validating the complete and empty state that stripe returns with onChange prop
          // It is needed to be used like this because when the form is submitted, it won't take in count
          // the errors from NewCardForm, so we have this as a second validation that everything is correct
          // INFO: TO GET THE CARD DATA WE HAVE TO USE elements.getElement from Stripe
          number: yup.object({
            complete: yup.boolean().oneOf([true], 'The number is not valid'),
            empty: yup.boolean().oneOf([false], 'The number is required'),
          }),
          expiry: yup.object({
            complete: yup
              .boolean()
              .oneOf([true], 'The expiry date is not valid'),
            empty: yup.boolean().oneOf([false], 'The expiry date is required'),
          }),
          cvc: yup.object({
            complete: yup.boolean().oneOf([true], 'The cvc is not valid'),
            empty: yup.boolean().oneOf([false], 'The cvc is required'),
          }),
        });
      },
    }),
    paymentMethod: yup.lazy((value: CheckoutForm['paymentMethod']) => {
      switch (typeof value) {
        case 'string': {
          // If paymentMethod is new_card, then it should fill the card details
          return yup.string().oneOf(['new_card']).required();
        }
        // if no, then it should provide an object with the id of the payment method, generally starting with
        // 'pm'
        case 'object': {
          return yup.object({
            id: yup.string().required(),
          });
        }
      }
    }),
  })
  .required();

const steps = ['Information', 'Payment'];

const getCustomerShippingFromCache = (
  cache: Cache,
  shippingId: number | null,
) => {
  const customerSavedShippings = cache.get(
    ADDRESSES_CRUD_TYPES.GET[ADDRESS_TYPES_ENUM.SHIPPING],
  ) as State<ReturnType<typeof useAddresses>['addresses']>;

  const selectedShipping = customerSavedShippings.data?.find(
    (a) => a.id === shippingId,
  );

  return selectedShipping;
};

const getCountryFromCache = (cache: Cache, countryId: number | string) => {
  const countriesCache = cache.get(COUNTRIES.LIST) as State<
    ReturnType<typeof useCountries>['countries']
  >;
  const foundCountry = getCountryFromList(countriesCache.data ?? [], countryId);

  return foundCountry;
};

const getBillingCountryAndStateFromCustomer = ({
  billingSameAsShipping,
  billingAddressForm,
  cache,
}: {
  billingSameAsShipping: boolean;
  billingAddressForm: number | null;
  cache: Cache;
}) => {
  let billingCountryIso2: string | null = null;
  let billingStateName: string | null = null;

  if (billingSameAsShipping) {
    const selectedShipping = getCustomerShippingFromCache(
      cache,
      billingAddressForm,
    );
    if (!selectedShipping) return;

    billingCountryIso2 = selectedShipping.country?.iso2;
    billingStateName = selectedShipping.state?.name;
  } else {
    const customerSavedBilling = cache.get(
      ADDRESSES_CRUD_TYPES.GET[ADDRESS_TYPES_ENUM.BILLING],
    ) as State<ReturnType<typeof useAddresses>['addresses']>;

    const selectedBilling = customerSavedBilling.data?.find(
      (a) => a.id === billingAddressForm,
    );

    if (!selectedBilling) return;

    billingCountryIso2 = selectedBilling.country?.iso2;
    billingStateName = selectedBilling.state?.name;
  }

  return { billingCountry: billingCountryIso2, billingState: billingStateName };
};

const getConfirmCheckoutProps = ({
  paymentMethodId,
  profile,
  cart,
  cache,
  currency,
  ...data
}: CheckoutForm & {
  paymentMethodId: string;
  profile: ProfileData | null;
  cart: Cart;
  cache: Cache;
  currency: string;
}): ConfirmCheckoutProps | null => {
  // Because the email is not needed anymore, we delete it if it is empty
  if (data.shipping && data.shipping?.email === '') {
    data.shipping.email = undefined;
  }
  if (data.billing && data.billing?.email === '') {
    data.billing.email = undefined;
  }

  const props: ConfirmCheckoutProps = {
    isGuest: !profile,
    products: cart.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
    })),
    paymentMethodId,
    guestEmail: !profile ? data.guestEmail : undefined,
    customerId: profile?.id,
    shipping: !data.savedShipping ? data.shipping : undefined,
    shippingId: data.savedShipping || undefined,
    currency,
  };

  if (data.billingSameAsShipping) {
    if (data.savedShipping) {
      const selectedShipping = getCustomerShippingFromCache(
        cache,
        data.savedShipping,
      );

      if (selectedShipping) {
        props.billing = {
          addressOne: selectedShipping.addressOne,
          addressTwo: selectedShipping.addressTwo,
          city: selectedShipping.city,
          firstName: selectedShipping.firstName,
          lastName: selectedShipping.lastName,
          phone: selectedShipping.phone,
          zipCode: selectedShipping.zipCode,
          email: selectedShipping.email,
          country: selectedShipping?.country?.id,
          state: selectedShipping?.state?.id,
        };
      } else {
        return null;
      }
    } else {
      props.billing = data.shipping;
    }

    props.billingId = undefined;
  } else {
    props.billing = !data.savedBilling ? data.billing : undefined;
    props.billingId = data.savedBilling || undefined;
  }

  // WHen the iso2 is provided by default for shipping or billing country, we need to get the country id
  // from the cache
  if (typeof props.shipping?.country === 'string') {
    const foundCountry = getCountryFromCache(cache, props.shipping.country);

    if (!foundCountry) {
      return null;
    }

    props.shipping.country = foundCountry.id;
  }
  if (typeof props.billing?.country === 'string') {
    const foundCountry = getCountryFromCache(cache, props.billing.country);

    if (!foundCountry) {
      return null;
    }

    props.billing.country = foundCountry.id;
  }

  return props;
};

const NewCheckout = () => {
  const { country: userCountry, currency } = useUserPreferencesStore(
    (state) => ({
      country: state.shippingCountry,
      currency: state.currency,
    }),
    shallow,
  );
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { profile } = useProfile();
  const { addresses: shippingAddresses } = useAddresses(
    ADDRESS_TYPES_ENUM.SHIPPING,
    Boolean(profile),
  );
  const { cartArray, isLoading: isLoadingCart, isEmpty } = useCart(true);
  const [successData, setSuccessData] = useState<
    null | OrderConfirmedModalProps['orderInfo']
  >(null);

  const methods = useForm<CheckoutForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      isGuest: !profile,
      guestEmail: '',
      shipping: {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: '',
        phone: '',
        country: userCountry ?? -1,
        state: -1,
        city: '',
        addressOne: '',
        addressTwo: '',
        zipCode: '',
      },
      billing: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: -1,
        state: -1,
        city: '',
        addressOne: '',
        addressTwo: '',
        zipCode: '',
      },

      card: {
        holder: profile
          ? [profile.firstName, profile.lastName].filter(Boolean).join(' ')
          : '',
        number: {
          complete: false,
          empty: true,
        },
        expiry: {
          complete: false,
          empty: true,
        },
        cvc: {
          complete: false,
          empty: true,
        },
      },

      billingSameAsShipping: true,
      savedShipping: Array.isArray(shippingAddresses)
        ? shippingAddresses?.find((a) => a.default)?.id ?? null
        : null,
      savedBilling: null,
      paymentMethod: 'new_card',
    },
  });
  const stripe = useStripe();
  const elements = useElements();
  const { cache } = useSWRConfig();
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;
  const { removeManyFromCart } = useCartActions();
  const { countries } = useCountries();
  const [shippingCountry, savedShipping] = useWatch<
    CheckoutForm,
    ['shipping.country', 'savedShipping']
  >({
    control: methods?.control,
    name: ['shipping.country', 'savedShipping'],
  });

  const shippingCountryIso2 = useMemo(() => {
    const shippingCountryId = savedShipping ?? shippingCountry;
    const country = countries?.length
      ? getCountryFromList(countries, shippingCountryId)
      : undefined;
    return country?.iso2;
  }, [countries, shippingCountry, savedShipping]);

  const onSubmit: SubmitHandler<CheckoutForm> = async (data) => {
    if (!stripe || !elements) return;
    if (!cartArray?.length) return;
    if (!currency) return;

    const { paymentMethod, billingSameAsShipping } = data;
    const products: ProductWithQuantity[] = cartArray.map((i) => ({
      ...i.product,
      quantity: i.quantity,
    }));

    if (paymentMethod === 'new_card') {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) return;

      let billingAddressForm: AddressFormData | number | null = null;

      if (data.billingSameAsShipping) {
        billingAddressForm = data.savedShipping || data.shipping;
      } else {
        billingAddressForm = data.savedBilling || data.billing;
      }

      if (!billingAddressForm) return;

      let billingCountryIso2: string | null = null;
      let billingStateName: string | null = null;

      if (typeof billingAddressForm === 'number') {
        const ids = getBillingCountryAndStateFromCustomer({
          billingSameAsShipping: billingSameAsShipping,
          cache,
          billingAddressForm,
        });
        billingCountryIso2 = ids?.billingCountry ?? null;
        billingStateName = ids?.billingState ?? null;
      } else if (
        typeof billingAddressForm === 'object' &&
        billingAddressForm !== null
      ) {
        const foundCountry = getCountryFromCache(
          cache,
          billingAddressForm?.country,
        );
        if (!foundCountry) return;

        const statesCache = cache.get(
          COUNTRIES.STATES(foundCountry.id),
        ) as State<ReturnType<typeof useCountryStates>['states']>;

        const foundState = statesCache.data?.find(
          (s) =>
            typeof billingAddressForm === 'object' &&
            s.id === billingAddressForm?.state,
        );

        if (!foundState) return;

        billingCountryIso2 = foundCountry.iso2;
        billingStateName = foundState.name;
      }

      let savedPaymentMethodId: string | null = null;

      try {
        const {
          paymentMethod: createdPaymentMethod,
          error: paymentMethodError,
        } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            address: {
              line1: data.billing.addressOne,
              line2: data.billing.addressTwo,
              city: data.billing.city,
              state: billingStateName ?? undefined,
              country: billingCountryIso2 ?? undefined,
              postal_code: data.billing.zipCode,
            },
          },
        });

        if (paymentMethodError) {
          throw paymentMethodError;
        }

        const {
          data: { client_secret },
        } = await createSetupIntent({
          customerId: profile?.id,
        });

        const { error } = await stripe.confirmCardSetup(client_secret, {
          payment_method: createdPaymentMethod.id,
        });

        if (error) {
          throw error;
        }

        // INFO: we know that the setup intent is correct and the payment method
        // got linked to the customer account, now we save it to handle it later
        // in case of error
        savedPaymentMethodId = createdPaymentMethod.id;

        const props = getConfirmCheckoutProps({
          ...data,
          paymentMethodId: createdPaymentMethod.id,
          profile,
          cart: cartArray,
          cache,
          currency,
        });

        if (!props) {
          return;
        }

        const response = await confirmCheckout(props);
        handleSuccess({ ...response.data, checkoutProducts: products });
      } catch (error) {
        // In case of error, we delete the "new" payment method
        if (savedPaymentMethodId && profile?.id) {
          await deleteCustomerCard(savedPaymentMethodId);
        }

        handleAxiosError(error);
      }
    } else if (typeof paymentMethod === 'object' && paymentMethod?.id) {
      try {
        const props = getConfirmCheckoutProps({
          ...data,
          paymentMethodId: paymentMethod.id,
          cache,
          cart: cartArray,
          profile,
          currency,
        });

        if (!props) {
          return;
        }

        const response = await confirmCheckout(props);
        handleSuccess({ ...response.data, checkoutProducts: products });
      } catch (error) {
        handleAxiosError(error);
      }
    }
  };

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSuccess = useCallback(
    (
      data: ConfirmCheckoutResponse['data'] & {
        checkoutProducts: ProductWithQuantity[];
      },
    ) => {
      setSuccessData({
        orders: data.orders,
        paymentMethod: data.paymentMethod,
        products: data.checkoutProducts.filter((p) =>
          data.successProducts.find((s) => s.id === p.id),
        ),
        shipping: data.shipping,
        pricing: data.pricing,
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    if (profile) {
      return;
    }

    cartArray?.length &&
      removeManyFromCart(cartArray?.map((item) => item.product.id));
  }, [cartArray, removeManyFromCart, profile]);

  const handleCloseSuccessModal = useCallback(() => {
    if (profile) {
      window.location.href = routes.DASHBOARD.MY_ORDERS;
      return;
    }

    clearCart();
    window.location.href = routes.INDEX;
  }, [profile, clearCart]);

  const StepManager = useCallback(() => {
    switch (activeStep) {
      case 0:
        return <InformationPage handleNext={handleNext} />;
      case 1:
        return (
          <PaymentPage
            handleBack={handleBack}
            shippingCountryIso2={shippingCountryIso2}
          />
        );
    }
  }, [activeStep, handleBack, handleNext, shippingCountryIso2]);

  useConfirmUnload(isDirty && useAuthModalStore.getState().isOpen === false);

  useEffect(() => {
    if (!isLoadingCart && isEmpty) {
      window.location.href = routes.CART.INDEX;
    }
  }, [isEmpty, isLoadingCart]);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CustomContainer>
        <div>
          {isMobile && <MobileCartBox activeStep={activeStep} />}
          <Stepper
            activeStep={activeStep}
            sx={{
              '& .MuiStepConnector-root': {
                flex: '0',
              },
            }}
          >
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step
                  key={label}
                  {...stepProps}
                  sx={{
                    paddingLeft: '0',
                    paddingRight: '40px',
                    '& .MuiStepLabel-iconContainer': {
                      padding: '0',
                      marginRight: '12px',
                    },
                    '& .MuiStepLabel-label': {
                      color: '# ]6A2C1',
                      fontSize: '14px',
                      lineHeight: '120%',
                      fontWeight: '400',
                    },
                    '& .MuiStepLabel-label.Mui-completed': {
                      fontWeight: '400',
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color: '#333E5C',
                      fontWeight: '500',
                    },
                  }}
                >
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={StepIconComponent}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <FormProvider {...methods}>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
              <div>{StepManager()}</div>
              <CartContainer>
                <CartViewBox
                  activeStep={activeStep}
                  shippingCountryIso2={shippingCountryIso2}
                />
              </CartContainer>
            </FormLayout>
          </FormProvider>
        </div>
      </CustomContainer>
      <Box
        sx={{
          marginTop: '96px',
          paddingBlock: '16px',
          borderTop: '1px solid #EAECF4',
        }}
      >
        <CustomContainer
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            sx={{
              color: '#96A2C1',
              fontSize: '12px',
              lineHeight: '16px',
            }}
          >
            Copyright © {new Date().getFullYear()} Only Latest, Inc. All rights
            reserved
          </Typography>
        </CustomContainer>
      </Box>
      <OrderConfirmedModal
        open={Boolean(successData)}
        onClose={handleCloseSuccessModal}
        orderInfo={successData}
        isGuest={!profile}
      />
    </Box>
  );
};

export default NewCheckout;
