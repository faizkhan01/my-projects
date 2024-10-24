import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Link as MuiLink } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ContainedButton } from '@/ui-kit/buttons';
import { PRegular } from '@/ui-kit/typography';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import ControlledFormCheckbox from '@/components/hookForm/ControlledFormCheckbox';
import { passwordSchema, emailSchema, REGEX } from '@/utils/yupValidations';
import { handleAxiosError } from '@/lib/axios';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';

import { SIGNUP_CUSTOMER_DEFAULT_VALUES } from '@/constants/auth';

import { SignUpCustomerFormData } from '@/types/auth';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import routes from '@/constants/routes';

type FormDataType = SignUpCustomerFormData;

const formSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .matches(REGEX.only.alpha, 'Can"t contain any special letters'),
  lastName: yup
    .string()
    .required('Last Name is required')
    .matches(REGEX.only.alpha, 'Can"t contain any special letters'),
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  terms: yup.boolean().oneOf([true]),
});

const SignUpCustomerForm = () => {
  const { control, handleSubmit, reset } = useForm<FormDataType>({
    defaultValues: SIGNUP_CUSTOMER_DEFAULT_VALUES,
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  const { loading, signUpCustomer } = useAuthActions();
  const openSnack = useGlobalSnackbar((state) => state.open);

  const onSubmit: SubmitHandler<FormDataType> = async (data) => {
    try {
      const response = await signUpCustomer(data);

      openSnack({
        severity: 'success',
        message: response.message,
      });
      reset();
    } catch (error) {
      handleAxiosError(error);
    }
  };

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
        type="email"
        placeholder="youremail@example.com"
      />
      <ControlledFormInput
        id="password"
        type="password"
        name="password"
        control={control}
        label="Password"
        placeholder="******"
      />
      <ControlledFormInput
        sx={{
          marginBottom: '1px',
        }}
        id="passwordConfirmation"
        type="password"
        name="passwordConfirmation"
        control={control}
        label="Confirm Password"
        placeholder="******"
      />
      <ControlledFormCheckbox
        sx={{
          marginBottom: '16px',
        }}
        name="terms"
        control={control}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <PRegular>I&apos;ve read and accept &nbsp;</PRegular>
            {/* INFO: We don't use Link of Next because there is not way to close the modal event with useNavigationEvent hook */}
            <MuiLink href={routes.PRIVACY_POLICY}>Privacy Policy</MuiLink>
          </Box>
        }
      />
      <ContainedButton type="submit" loading={loading}>
        Sign Up
      </ContainedButton>
    </Box>
  );
};

export default SignUpCustomerForm;
