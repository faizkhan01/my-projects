import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { ContainedButton } from '@/ui-kit/buttons';
import { ModalCardContainer } from '@/ui-kit/containers';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

interface Props {
  setClose: () => void;
}

export const ContinueShoppingModal = ({ setClose }: Props) => {
  const open = useAuthModalStore((state) => state.open);

  return (
    <ModalCardContainer
      minHeight="408px"
      cardSx={{
        maxWidth: {
          sm: '570px',
        },
        maxHeight: {
          sm: '408px',
        },
      }}
    >
      <Box
        sx={{
          pt: { xs: '136px', sm: '0px' },
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            paddingLeft: { xs: '20px', sm: '29px' },
            paddingRight: { xs: '20px', sm: '29px' },
            mb: '12px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: '28px',
                sm: '40px',
              },
              lineHeight: { xs: '33.6px', sm: '48px' },
            }}
          >
            Sign in to continue shopping.
          </Typography>
        </Box>
        <Box
          sx={{
            paddingLeft: { xs: '23px', sm: '32px', md: '' },
            paddingRight: { xs: '23px', sm: '32px', md: '' },
            mb: '40px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: { xs: '12px', md: '14px' },
              lineHeight: { xs: '19.2px', md: '22.4px' },
            }}
          >
            To continue shopping, you must log in to your account or continue as
            a guest.
          </Typography>
        </Box>
      </Box>
      <div className="flex flex-col justify-center">
        <div className="mb-8">
          <ContainedButton
            fullWidth
            onClick={() => {
              setClose();
              open('login');
            }}
          >
            Log In
          </ContainedButton>
        </div>
        <Button component={Link} href="checkout">
          Login as a guest
        </Button>
      </div>
    </ModalCardContainer>
  );
};
