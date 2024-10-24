'use client';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import routes from '@/constants/routes';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { handleAxiosError } from '@/lib/axios';
import { ContainedButton } from '@/ui-kit/buttons';
import { passwordSchema } from '@/utils/yupValidations';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Button } from '@mui/material';
import { CaretLeft, CheckCircle, XCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object } from 'yup';

interface CheckedTextProps {
  check: boolean;
  text: string;
}

const CheckedText = ({ check, text }: CheckedTextProps) => (
  <div
    className={`flex items-center ${
      check ? 'text-[#333E5C]' : 'text-error-main'
    }`}
  >
    {check ? (
      <CheckCircle weight="fill" size={14} />
    ) : (
      <XCircle weight="fill" size={14} className="" />
    )}
    <Typography
      sx={{
        ml: 1,
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
      }}
    >
      {text}
    </Typography>
  </div>
);

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const formSchema = object().shape({
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

const defaultValues = {
  password: '',
  confirmPassword: '',
};

const ResetPasswordPage = ({ code }: { code: string }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const open = useAuthModalStore((state) => state.open);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const passwordValidations = {
    length: typeof password === 'string' && password.length >= 8,
    oneNumber: typeof password === 'string' && /\d/.test(password),
    oneLowerCase: typeof password === 'string' && /(.*[a-z].*)/.test(password),
    oneUpperCase: typeof password === 'string' && /(.*[A-Z].*)/.test(password),
    passwordsMatch:
      typeof password === 'string' &&
      typeof confirmPassword === 'string' &&
      password === confirmPassword,
  };

  const isAbleToSubmit = () => {
    const pwv = passwordValidations;
    return (
      pwv.length &&
      pwv.oneLowerCase &&
      pwv.oneNumber &&
      pwv.oneUpperCase &&
      pwv.passwordsMatch &&
      !isSubmitSuccessful
    );
  };

  const { resetPasswordConfirm, loading: loadingActions } = useAuthActions();

  const loading = loadingActions || isSubmitting;

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (data.password !== data.confirmPassword) return;
    const cleanPassword = data.password;

    try {
      if (typeof code === 'string') {
        const res = await resetPasswordConfirm(code, cleanPassword);
        if (res) {
          open('login');
          reset(defaultValues);
        }
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="max-w-[430px]">
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Typography
              component="h1"
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: '28px',
                  sm: '40px',
                },
                lineHeight: '48px',
                mb: '4px',
              }}
            >
              Set new password
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '19.2px',
              }}
            >
              Your new password must be different to previous used passwords.
            </Typography>
          </div>

          <div className="space-y-2">
            <CheckedText
              check={passwordValidations.length}
              text="Has at leasts 8 characters"
            />
            <CheckedText
              check={passwordValidations.oneNumber}
              text="Contains at least one number"
            />
            <CheckedText
              check={passwordValidations.oneLowerCase}
              text="Contains at least one lowercase letter"
            />
            <CheckedText
              check={passwordValidations.oneUpperCase}
              text="Contains at least one uppercase letter"
            />
          </div>

          <div>
            <ControlledFormInput
              control={control}
              name="password"
              label="New Password"
              id="newPassword"
              placeholder="Enter your new password"
              type="password"
            />

            <div className="mt-6">
              <ControlledFormInput
                control={control}
                name="confirmPassword"
                label="Confirm New Password"
                id="confirmPassword"
                placeholder="Enter your new password"
                type="password"
              />
            </div>
          </div>

          <ContainedButton
            fullWidth
            size="large"
            disabled={!isAbleToSubmit()}
            type="submit"
            loading={loading}
          >
            Save new password
          </ContainedButton>

          <div className="flex justify-center">
            <Button
              className="py-0 text-[14px] font-medium text-[#333E5C]"
              component={Link}
              href={routes.INDEX}
            >
              <CaretLeft size={16} />
              <span>Back Home</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
