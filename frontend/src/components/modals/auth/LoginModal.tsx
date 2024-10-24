import { memo } from 'react';
import { styled } from '@mui/material/styles';
import { Box, ButtonBase } from '@mui/material';
import { PRegular, SubHeadingBold } from '@/ui-kit/typography';
import { ModalCardContainer } from '@/ui-kit/containers';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import LoginForm from './forms/LoginForm';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import { LoginFormData } from '@/types/auth';
import { handleAxiosError } from '@/lib/axios';

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  marginTop: '40px',
}));

const SUBHEADING_STYLES = {
  cursor: 'pointer',
  '&:hover': {
    transition: '0.4s',
    color: 'primary.dark',
  },
};

const LoginModal: React.FC = memo(() => {
  const open = useAuthModalStore((state) => state.open);

  const { loading, login } = useAuthActions();
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const onForgotPasswordClick = () => open('forgotPassword');

  return (
    <ModalCardContainer title="Welcome" subTitle="Log In to continue">
      <StyledBox>
        <LoginForm
          onSubmit={onSubmit}
          loading={loading}
          onForgotPasswordClick={onForgotPasswordClick}
        />
        <Box sx={{ textAlign: 'center', pt: '32px' }}>
          <PRegular sx={{ pb: '7px' }}>Do you have an account?</PRegular>
          <ButtonBase onClick={() => open('register')}>
            <SubHeadingBold sx={SUBHEADING_STYLES} color="primary.main">
              Create an account
            </SubHeadingBold>
          </ButtonBase>
        </Box>
      </StyledBox>
    </ModalCardContainer>
  );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;
