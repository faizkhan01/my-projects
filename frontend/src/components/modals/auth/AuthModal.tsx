import dynamic from 'next/dynamic';
import { shallow } from 'zustand/shallow';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { ModalContainer } from '@/ui-kit/containers';
import { LoadingBackdrop } from '@/ui-kit/backdrops';

const LoginModal = dynamic(() => import('./LoginModal'), {
  loading: () => <LoadingBackdrop open={true} />,
});
const SignUpModal = dynamic(() => import('./SignUpModal'), {
  loading: () => <LoadingBackdrop open={true} />,
});
const ForgotPasswordModal = dynamic(() => import('./ForgotPasswordModal'), {
  loading: () => <LoadingBackdrop open={true} />,
});

const AuthModal = () => {
  const query = useSearchParams();

  const { isOpen, close, modal, open } = useAuthModalStore(
    (state) => ({
      isOpen: state.isOpen,
      close: state.close,
      modal: state.modal,
      open: state.open,
    }),
    shallow,
  );

  useEffect(() => {
    if (query.get('reset-password')) {
      open('resetPassword');
    }
    if (query.get('login')) {
      open('login');
    }

    if (query?.get('signup')) {
      open('register');
    }
  }, [query, open]);

  const renderModalContent = () => {
    switch (modal) {
      case 'login':
        return <LoginModal />;
      case 'register':
        return <SignUpModal />;
      case 'forgotPassword':
        return <ForgotPasswordModal />;
      default:
        return null;
    }
  };

  return (
    <ModalContainer open={isOpen} onClose={close}>
      {renderModalContent()}
    </ModalContainer>
  );
};

export default AuthModal;
