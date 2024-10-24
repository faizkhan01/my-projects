import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, ButtonBase } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { ContainedButton } from '@/ui-kit/buttons';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { emailSchema } from '@/utils/yupValidations';
import { LOGIN_DEFAULT_VALUES } from '@/constants/auth';

import { LoginFormData } from '@/types/auth';
import { SubHeadingBold } from '@/ui-kit/typography';

const formSchema = object().shape({
  email: emailSchema,
  password: string().required('The password is required'),
});

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormData>;
  loading: boolean;
  onForgotPasswordClick: () => void;
}

const LoginForm = ({
  onSubmit,
  loading,
  onForgotPasswordClick,
}: LoginFormProps): JSX.Element => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const SUBHEADING_STYLES = {
    cursor: 'pointer',
    '&:hover': {
      transition: '0.4s',
      color: 'primary.dark',
    },
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
        id="email"
        name="email"
        control={control}
        label="Email"
        placeholder="Your email address"
      />
      <ControlledFormInput
        id="password"
        type="password"
        name="password"
        control={control}
        label="Password"
        placeholder="Your password"
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <ButtonBase
          sx={{
            marginTop: '-12px',
            mb: 2,
          }}
          onClick={onForgotPasswordClick}
        >
          <SubHeadingBold color="primary.main" sx={SUBHEADING_STYLES}>
            Forgot password?
          </SubHeadingBold>
        </ButtonBase>
      </Box>
      <ContainedButton loading={loading} type="submit">
        Log In
      </ContainedButton>
    </Box>
  );
};

export default LoginForm;
