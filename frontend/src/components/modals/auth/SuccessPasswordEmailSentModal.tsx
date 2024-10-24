import { Box, ButtonBase, Typography } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { ModalCardContainer } from '@/ui-kit/containers';

interface Props {
  email: string;
  resendEmail: () => void;
}

const SuccessPasswordEmailSentModal = ({ email, resendEmail }: Props) => {
  const { open } = useAuthModalStore(
    (state) => ({
      open: state.open,
    }),
    shallow,
  );
  return (
    <ModalCardContainer
      cardSx={{
        paddingTop: { xs: '196px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box>
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="30" r="30" fill="#5F59FF" />
            <path
              d="M42.9994 25.9904C42.9988 25.9139 42.9893 25.8378 42.9711 25.7635C42.9691 25.7549 42.9664 25.7464 42.9641 25.7379C42.9565 25.7098 42.9476 25.6821 42.9376 25.6546C42.9338 25.6445 42.9299 25.6344 42.9259 25.6243C42.9155 25.5988 42.9037 25.5736 42.8911 25.5486C42.8862 25.5389 42.8816 25.5291 42.8764 25.5195C42.8615 25.4924 42.845 25.4659 42.8273 25.4398C42.8234 25.4341 42.8201 25.4279 42.816 25.4222L42.8142 25.4194C42.7927 25.3894 42.7695 25.3606 42.7449 25.3332C42.7394 25.3271 42.7335 25.3216 42.7279 25.3157C42.7068 25.2933 42.6851 25.2719 42.6625 25.2517C42.6549 25.245 42.647 25.2386 42.6392 25.2321C42.6161 25.2129 42.5924 25.1949 42.568 25.178C42.5634 25.1748 42.5593 25.171 42.5547 25.1679L30.5547 17.1679C30.3904 17.0584 30.1974 17 30 17C29.8026 17 29.6096 17.0584 29.4453 17.1679L17.4453 25.1679C17.4408 25.1709 17.437 25.1746 17.4326 25.1776C17.4078 25.1947 17.3838 25.213 17.3605 25.2324C17.3529 25.2388 17.3452 25.245 17.3378 25.2515C17.3149 25.2718 17.2929 25.2934 17.2717 25.3161C17.2663 25.3218 17.2605 25.3272 17.2552 25.3331C17.2305 25.3606 17.2073 25.3894 17.1858 25.4194L17.184 25.4222C17.1799 25.4279 17.1766 25.4341 17.1727 25.4398C17.155 25.4659 17.1385 25.4924 17.1236 25.5195C17.1184 25.5291 17.1138 25.5389 17.1089 25.5486C17.0963 25.5736 17.0845 25.5988 17.0741 25.6243C17.0701 25.6344 17.0662 25.6445 17.0624 25.6546C17.0523 25.6821 17.0435 25.7099 17.0359 25.7379C17.0336 25.7464 17.031 25.7549 17.0289 25.7635C17.0107 25.8378 17.0013 25.9139 17.0006 25.9904C17.0005 25.9936 17 25.9967 17 25.9999V38.9999C17.0006 39.5302 17.2115 40.0386 17.5865 40.4135C17.9614 40.7884 18.4698 40.9993 19 40.9999H41C41.5302 40.9993 42.0386 40.7884 42.4135 40.4135C42.7885 40.0386 42.9994 39.5302 43 38.9999V25.9999C43 25.9967 42.9995 25.9936 42.9994 25.9904ZM19 27.941L26.0903 32.9962L19 38.0045V27.941ZM28.1357 33.9999H31.8643L38.9429 38.9999H21.0572L28.1357 33.9999ZM33.9097 32.9962L41 27.941V38.0045L33.9097 32.9962Z"
              fill="white"
            />
          </svg>
        </Box>
        <Box mb="12px">
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '48px',
            }}
            component="h3"
          >
            Check your email
          </Typography>
        </Box>
        <Box mb="6px">
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '19.2px',
            }}
          >
            We send a password reset link to
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '12px',
            lineHeight: '19.2px',
          }}
        >
          {email}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: '24px',
            mb: '24px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '22.4px',
            }}
          >
            Didn&apos;t receive the email?
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '22.4px',
              ml: 0.5,
              color: '#5F59FF',
              cursor: 'pointer',
            }}
            onClick={() => resendEmail()}
          >
            Click to resend
          </Typography>
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
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '22.4px',
              }}
            >
              Back to Log In
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </ModalCardContainer>
  );
};

export default SuccessPasswordEmailSentModal;
