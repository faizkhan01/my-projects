'use client';
import { useEffect, useCallback, DragEvent, useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import routes from '@/constants/routes';
import { BackLinkButton, Button, OutlinedButton } from '@/ui-kit/buttons';
import { Typography, ButtonBase } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { ControlledNumber } from '@/components/hookForm/ControlledNumber';
import ControlledStateSelector from '@/components/hookForm/ControlledStateSelector';
import ControlledCountrySelector from '@/components/hookForm/ControlledCountrySelector';
import { SellerSettingForm } from '@/types/sellerSetting';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  emailSchema,
  passwordSchema,
  postalCodeSchema,
  storeNameSchema,
} from '@/utils/yupValidations';
import useValidateStore from '@/hooks/queries/useValidateStore';
import { updateSellerSettings } from '@/services/API/seller/settings';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import { handleAxiosError } from '@/lib/axios';
import { DragAndDropImageInput } from './DragAndDropImageInput';
import { BottomPageActions } from '../dashboard/BottomPageActions';
import { flushSync } from 'react-dom';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { MobileHeading } from '@/ui-kit/typography';
import { useAuthStore } from '@/hooks/stores/useAuthStore';
import useCountries from '@/hooks/queries/useCountries';
import { Country } from 'react-phone-number-input';
import { getCountryFromList } from '@/utils/countries';
import { phoneSchema } from '@/utils/yupValidations/phoneSchema';
import dynamic from 'next/dynamic';
import { ControlledFormSelect } from '../hookForm/ControlledFormSelect';
import { MenuItem } from '@/ui-kit/menu';
import { useDebounce } from '@/hooks/useDebounce';

const CloseStoreModal = dynamic(
  () => import('../modals/sellers/CloseStoreModal'),
  {
    ssr: false,
  },
);

const StyledBox = styled('div')(() => ({
  backgroundColor: 'common.white',
  marginBottom: '30px',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  padding: '24px',
}));

const TopicText = styled(Typography)(() => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  lineHeight: '24px',
  marginBottom: '16px',
}));

interface Props {
  defaultValues?: SellerSettingForm;
  availableCurrencies: string[];
}

const formSchema = yup.object().shape({
  storeName: storeNameSchema.required('Shop Name is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: emailSchema,
  oldPassword: yup.string(),
  newPassword: yup.string().when('oldPassword', {
    is: (oldPassword: string) => oldPassword !== '',
    then: () => passwordSchema,
  }),
  newPasswordConfirmation: yup.string().when('oldPassword', {
    is: (oldPassword: string) => oldPassword !== '',
    then: (s) =>
      s
        .required('Confirm your new password')
        .oneOf([yup.ref('newPassword')], 'Must match your new password'),
  }),
  phone: phoneSchema,
  addressOne: yup.string().ensure(),
  addressTwo: yup.string().ensure(),
  city: yup.string(),
  state: yup.number(),
  country: yup.number(),
  zipCode: postalCodeSchema,
});

const createDefaultValues: SellerSettingForm = {
  logo: null,
  banner: null,
  storeName: '',
  firstName: '',
  lastName: '',
  currency: '',
  phone: '',
  email: '',
  country: -1,
  state: -1,
  city: '',
  addressOne: '',
  addressTwo: '',
  zipCode: '',
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

const TitleText = styled(Typography)(() => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '12px',
  lineHeight: '16px',
  marginBottom: '8px',
}));

const BoxTitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '16px',
  marginTop: '16px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const CloseStoreComp = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CloseStoreModal open={open} onClose={() => setOpen(false)} />
      <StyledBox className="mb-0 mt-12 flex flex-col items-center justify-between gap-4 bg-[#F6F9FF] px-6 py-4 shadow-none sm:flex-row">
        <Typography
          sx={{ fontWeight: '600', fontSize: '16px', lineHeight: '24px' }}
        >
          Do you want to close your shop?
        </Typography>
        <div className="w-full sm:max-w-[180px]">
          <OutlinedButton
            onClick={() => setOpen(true)}
            fullWidth
            type="button"
            size="large"
            className="border-none bg-white shadow-[0px_0.5008620619773865px_6.636422634124756px_0px_rgba(0,0,0,0.02),0px_4px_53px_0px_rgba(0,0,0,0.04)]"
          >
            Close the shop
          </OutlinedButton>
        </div>
      </StyledBox>
    </>
  );
};

const SellerSetting = ({ defaultValues, availableCurrencies }: Props) => {
  const {
    reset,
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    formState: { isDirty, defaultValues: formDefaultValues },
    getFieldState,
    setFocus,
  } = useForm({
    defaultValues: defaultValues ? defaultValues : createDefaultValues,
    resolver: yupResolver(formSchema),
  });
  const [isChangingMail, setIsChangingMail] = useState(false);
  const openSnack = useGlobalSnackbar((state) => state.open);
  const openAuth = useAuthModalStore((state) => state.open);
  const updateAuth = useAuthStore((state) => state.initialize);

  const resetStateValue = useCallback(() => setValue('state', -1), [setValue]);

  const handleForgotPasswordClick = () => {
    openAuth('forgotPassword');
  };

  const handleChangeEmailClick = () => {
    // This is to make sure that it's not disabled before making the focus
    flushSync(() => {
      setIsChangingMail(true);
    });

    setFocus('email', {
      shouldSelect: true,
    });
  };

  const onDropImage = (
    e: DragEvent<HTMLDivElement>,
    type: 'logo' | 'banner',
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;

    for (const file of Array.from(files)) {
      if (!file.type.includes('image')) {
        setError(type, {
          type: 'manual',
          message: 'Only images are allowed',
        });
        setValue(type, null);
        return;
      }
    }

    const image = e.dataTransfer.files[0];

    clearErrors(type);
    setValue(type, image);
  };

  const logoImage = watch('logo');
  const bannerImage = watch('banner');
  const storeNameState = getFieldState('storeName');

  const country = useWatch({
    name: 'country',
    control,
  });

  const { countries } = useCountries();
  const foundCountry = useMemo(
    () => getCountryFromList(countries ?? [], country),
    [country, countries],
  );

  const onSubmit = async (data: SellerSettingForm) => {
    const updateData = new FormData();
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          if (formDefaultValues) {
            if (value !== formDefaultValues[key as keyof SellerSettingForm]) {
              updateData.append(key, value);
            }
          } else {
            updateData.append(key, value);
          }
        }
      });
      const response = await updateSellerSettings(updateData);
      openSnack({
        severity: 'success',
        message: response.message,
      });
      updateAuth();
      const respData = response.data;
      const logo = respData?.logo?.url ?? null;
      const banner = respData?.banner?.url ?? null;
      const formSettings: SellerSettingForm = {
        ...respData,
        newPassword: '',
        newPasswordConfirmation: '',
        oldPassword: '',
        banner: banner,
        logo: logo,
        country: respData?.country?.id,
        state: respData?.state?.id,
      };
      reset(formSettings);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const debouncedName = useDebounce(watch('storeName'));
  const {
    isValid: isValidStoreName,
    isLoading: isLoadingStore,
    isError,
  } = useValidateStore(debouncedName);

  const getAsyncStatus = useCallback(() => {
    if (!storeNameState.isDirty) return;
    if (isLoadingStore) {
      return 'loading';
    }
    if (isValidStoreName) {
      return 'success';
    }
    return undefined;
  }, [isValidStoreName, isLoadingStore, storeNameState.isDirty]);

  useEffect(() => {
    if (formDefaultValues?.country !== country) resetStateValue();
  }, [country, formDefaultValues?.country, resetStateValue]);

  useEffect(() => {
    if (storeNameState.isDirty && isValidStoreName?.valid === false) {
      setError('storeName', {
        type: 'manual',
        message: isValidStoreName.reason,
      });
    } else if (storeNameState.isDirty && isValidStoreName) {
      setError('storeName', {
        type: 'manual',
        message: '',
      });
    }
    if (isError) {
      setError('storeName', {
        type: 'manual',
        message: 'Something went wrong',
      });
    }
  }, [isValidStoreName, setError, isError, storeNameState.isDirty]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackLinkButton />
      <MobileHeading title="Seller Setting" />
      <StyledBox>
        <TopicText>Shop settings</TopicText>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-[145px_1fr]">
          <div>
            <TitleText>Store logo</TitleText>
            <DragAndDropImageInput
              info="Max 100x100 px"
              name="logo"
              onDropImage={(e) => onDropImage(e, 'logo')}
              setValue={(file) => {
                setValue('logo', file, {
                  shouldDirty: true,
                });
              }}
              value={logoImage}
            />
            {logoImage !== null && typeof logoImage !== 'string' ? (
              <BoxTitleText>1 Logo Image Added</BoxTitleText>
            ) : null}
          </div>

          <div>
            <TitleText>Shop banner</TitleText>
            <DragAndDropImageInput
              info="Maximum aspect ratio 1440x170 px, 12MB"
              name="banner"
              onDropImage={(e) => onDropImage(e, 'banner')}
              setValue={(file) => {
                setValue('banner', file, {
                  shouldDirty: true,
                });
              }}
              value={bannerImage}
            />
            {bannerImage !== null && typeof bannerImage !== 'string' ? (
              <BoxTitleText>1 Banner Image Added</BoxTitleText>
            ) : null}
          </div>
        </div>

        <TopicText>Basic Information</TopicText>
        <div className="mb-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <ControlledFormInput
            id="storeName"
            name="storeName"
            control={control}
            label="Name of shop"
            placeholder="Ollivander's Wand Shop"
            async={getAsyncStatus()}
          />
          <ControlledCountrySelector
            id="country"
            name="country"
            control={control}
            label="Shop country"
            placeholder="United States"
            type="seller_available"
            disabled
          />
          <ControlledFormSelect
            id="currency"
            name="currency"
            control={control}
            label="Currency"
            SelectProps={{
              displayEmpty: true,
            }}
            helperText="This action will modify the currency and pricing for both the product and shipping."
          >
            <MenuItem disabled value="">
              Select a currency
            </MenuItem>
            {availableCurrencies.map((c) => {
              const v = c.toUpperCase();

              return (
                <MenuItem value={v} key={v}>
                  {v}
                </MenuItem>
              );
            })}
          </ControlledFormSelect>
        </div>
        <TopicText>Personal information</TopicText>
        <div className="mb-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <ControlledFormInput
            id="firstName"
            name="firstName"
            control={control}
            label="First Name"
            placeholder="Caeleb"
          />
          <ControlledFormInput
            id="lastName"
            name="lastName"
            control={control}
            label="Last Name"
            placeholder="Dressel"
          />
          <ControlledNumber
            id="phone"
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="409 757 5013"
            country={(foundCountry?.iso2 as Country) ?? 'US'}
          />

          <div className="relative">
            <ControlledFormInput
              id="email"
              name="email"
              control={control}
              label={
                <div className="flex items-center justify-between">
                  <span>E-mail</span>

                  <ButtonBase
                    sx={{
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: 'primary.main',
                    }}
                    onClick={handleChangeEmailClick}
                  >
                    Change email
                  </ButtonBase>
                </div>
              }
              placeholder="username@gmail.com"
              disabled={!isChangingMail}
            />
          </div>

          <ControlledStateSelector
            id="state"
            name="state"
            control={control}
            label="State"
            placeholder="Select a state"
            countryId={foundCountry?.id ?? null}
          />

          <ControlledFormInput
            id="city"
            name="city"
            control={control}
            label="City"
            placeholder="Green Cove Springs"
          />
          <ControlledFormInput
            id="address"
            name="addressOne"
            control={control}
            label="Address"
            placeholder="4517 Washington Ave"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[3fr_1fr]">
            <ControlledFormInput
              id="addressTwo"
              name="addressTwo"
              control={control}
              type="text"
              label="Apt, suite, unit, building, floor, etc. (Optional)"
              placeholder="Address (Optional)"
            />
            <ControlledFormInput
              id="zipCode"
              name="zipCode"
              control={control}
              label="Zip Code"
              placeholder="Zip Code"
            />
          </div>
        </div>
      </StyledBox>

      <StyledBox>
        <div className="flex justify-between text-center">
          <TopicText>Password</TopicText>
          <Button
            onClick={handleForgotPasswordClick}
            className="h-fit min-h-0 p-0 text-sm/6 font-semibold not-italic text-primary-main sm:text-lg/6"
          >
            Forgot your password?
          </Button>
        </div>
        <div className="mb-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <ControlledFormInput
            id="password"
            type="password"
            name="oldPassword"
            control={control}
            label="Old password"
            placeholder="Enter old password"
          />

          <ControlledFormInput
            id="newPassword"
            type="password"
            name="newPassword"
            control={control}
            label="New Password"
            placeholder="Enter New password"
          />

          <ControlledFormInput
            id="newPasswordConfirmation"
            type="password"
            name="newPasswordConfirmation"
            control={control}
            label="Repeat new password"
            placeholder="Enter Repeat new password"
          />
        </div>
      </StyledBox>
      <BottomPageActions
        backHref={routes.SELLER_DASHBOARD.INDEX}
        disabled={!isDirty}
      />
      <CloseStoreComp />
    </form>
  );
};

export default SellerSetting;
