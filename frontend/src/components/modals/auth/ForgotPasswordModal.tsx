import { shallow } from 'zustand/shallow';
import dynamic from 'next/dynamic';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, ButtonBase } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { object } from 'yup';
import { ArrowLeft } from '@phosphor-icons/react';
import { useState } from 'react';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { emailSchema } from '@/utils/yupValidations';
import { ContainedButton } from '@/ui-kit/buttons';
import { ModalCardContainer } from '@/ui-kit/containers';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import useProfile from '@/hooks/queries/useProfile';

const SuccessPasswordEmailSentModal = dynamic(
  () => import('./SuccessPasswordEmailSentModal'),
);

interface ForgotPasswordFormData {
  email: string;
}

const formSchema = object().shape({
  email: emailSchema,
});

const defaultValues = {
  email: '',
};

const ForgotPasswordModal = () => {
  const { profile } = useProfile();
  const { resetPassword } = useAuthActions();
  const [successEmailSent, setSuccessEmailSent] = useState<string>('');
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(formSchema),
    defaultValues,
    values: { email: profile?.email || '' },
  });
  const { open } = useAuthModalStore(
    (state) => ({
      open: state.open,
    }),
    shallow,
  );

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    const res = await resetPassword(data.email);
    if (res) setSuccessEmailSent(data.email);
  };

  const resendEmail = () => {
    if (successEmailSent === '') return;
    const email = successEmailSent;
    setValue('email', email);
    setSuccessEmailSent('');
  };

  return successEmailSent !== '' ? (
    <SuccessPasswordEmailSentModal
      email={successEmailSent}
      resendEmail={resendEmail}
    />
  ) : (
    <ModalCardContainer
      title="Forgot Password ?"
      subTitle="No worries, we'll send you reset instructions"
      cardSx={{
        paddingTop: { xs: '165px' },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'grid',
          mt: { xs: '41px' },
        }}
      >
        <ControlledFormInput
          control={control}
          name="email"
          label="Email"
          id="email"
          placeholder="Your email address"
        />
        <Box
          sx={{
            mt: '32px',
            mb: '24px',
          }}
        >
          <ContainedButton fullWidth type="submit" loading={isSubmitting}>
            Reset Password
          </ContainedButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ButtonBase
            onClick={() => open('login')}
            type="button"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                color: 'text.secondary',
              }}
            >
              <ArrowLeft size={18} />
            </Box>
            Back to Log In
          </ButtonBase>
        </Box>
      </Box>
    </ModalCardContainer>
  );
};

export default ForgotPasswordModal;
