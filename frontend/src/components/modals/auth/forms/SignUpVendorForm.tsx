import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Link as MuiLink } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ContainedButton } from '@/ui-kit/buttons';
import { PRegular } from '@/ui-kit/typography';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import ControlledFormCheckbox from '@/components/hookForm/ControlledFormCheckbox';
import {
  passwordSchema,
  emailSchema,
  REGEX,
  storeNameSchema,
} from '@/utils/yupValidations';
import { SIGNUP_VENDOR_DEFAULT_VALUES } from '@/constants/auth';

import { SignUpVendorFormData } from '@/types/auth';
import useValidateStore from '@/hooks/queries/useValidateStore';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import ControlledCountrySelector from '@/components/hookForm/ControlledCountrySelector';
import { handleAxiosError } from '@/lib/axios';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import routes from '@/constants/routes';
import { useDebounce } from '@/hooks/useDebounce';

type FormDataType = SignUpVendorFormData;

const formSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .matches(REGEX.only.alpha, 'Can"t contain any special letters'),
  lastName: yup
    .string()
    .required('Last Name is required')
    .matches(REGEX.only.alpha, 'Can"t contain any special letters'),
  // I have to use positive because the countryId type must be a number
  // and the default value is 0
  countryId: yup
    .number()
    .positive('Country is required')
    .required('Country is required'),
  email: emailSchema,
  storeName: storeNameSchema.required('Shop name is required'),
  password: passwordSchema,
  passwordConfirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  terms: yup.boolean().oneOf([true]),
});

const SignUpVendorForm = () => {
  const { control, handleSubmit, reset, watch, setError } =
    useForm<FormDataType>({
      defaultValues: SIGNUP_VENDOR_DEFAULT_VALUES,
      mode: 'onSubmit',
      resolver: yupResolver(formSchema),
    });
  const debouncedName = useDebounce(watch('storeName'));
  const {
    isValid,
    isLoading: isLoadingStore,
    isError,
  } = useValidateStore(debouncedName);
  const { loading: loadingSubmit, signUpVendor } = useAuthActions();
  const openSnack = useGlobalSnackbar((state) => state.open);

  const onSubmit: SubmitHandler<FormDataType> = async (data) => {
    if (!isValid || isError) return;
    try {
      const response = await signUpVendor(data);

      openSnack({
        severity: 'success',
        message: response.message,
      });
      reset(SIGNUP_VENDOR_DEFAULT_VALUES);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const getAsyncStatus = () => {
    if (isLoadingStore) {
      return 'loading';
    }
    if (isValid?.valid) {
      return 'success';
    }
    return undefined;
  };

  useEffect(() => {
    if (isValid?.valid === false) {
      setError('storeName', {
        type: 'manual',
        message: isValid.reason,
      });
    } else if (isValid?.valid === true) {
      setError('storeName', {
        type: 'manual',
        message: '',
      });
    } else if (isError) {
      setError('storeName', {
        type: 'manual',
        message: 'Something went wrong',
      });
    }
  }, [isValid, setError, isError]);

  return (
    <Box
      component="form"
      sx={{
        display: 'grid',
        gap: { xs: 3, sm: 3 },
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControlledFormInput
        id="firstName"
        name="firstName"
        control={control}
        label="First Name"
        placeholder="First Name"
      />
      <ControlledFormInput
        id="lastName"
        name="lastName"
        control={control}
        label="Last Name"
        placeholder="Last Name"
      />
      <ControlledFormInput
        id="email"
        name="email"
        control={control}
        label="Email Address"
        placeholder="youremail@example.com"
      />
      <ControlledCountrySelector
        id="country"
        name="countryId"
        control={control}
        label="Country"
        placeholder="Select a country"
        type="seller_available"
      />
      <ControlledFormInput
        id="shop"
        name="storeName"
        control={control}
        label="Shop Name"
        placeholder="Shop Name"
        async={getAsyncStatus()}
      />
      <ControlledFormInput
        id="password"
        name="password"
        control={control}
        label="Password"
        placeholder="*****"
        type="password"
      />
      <ControlledFormInput
        sx={{
          marginBottom: '1px',
        }}
        id="passwordConfirmation"
        name="passwordConfirmation"
        control={control}
        label="Confirm Password"
        placeholder="*****"
        type="password"
      />
      <ControlledFormCheckbox
        sx={{
          marginBottom: '16px',
        }}
        name="terms"
        control={control}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PRegular>I&apos;ve read and accept &nbsp;</PRegular>
            {/* INFO: We don't use Link of Next because there is not way to close the modal event with useNavigationEvent hook */}
            <MuiLink href={routes.PRIVACY_POLICY}>Privacy Policy</MuiLink>
          </Box>
        }
      />
      <ContainedButton
        type="submit"
        disabled={Boolean(isLoadingStore)}
        loading={loadingSubmit}
      >
        Sign Up
      </ContainedButton>
    </Box>
  );
};

export default SignUpVendorForm;
