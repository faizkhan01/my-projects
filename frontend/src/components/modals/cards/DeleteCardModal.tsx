import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { Box, Button } from '@mui/material';
import { PaymentCard } from '@/components/dashboard/paymentMethods/PaymentCard';
import type { Card } from '@/types/paymentMethods';

interface DeleteCardModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  card: Card | null;
  isLoading: boolean;
}

const buttonStyle = {
  width: {
    xs: '100%',
    sm: '173px',
  },
  height: '48px',
  padding: '11px 121px 11px, 121px',
  borderRadius: '2px',
};

const DeleteCardModal = ({
  open,
  onClose,
  onDelete,
  card,
  isLoading,
}: DeleteCardModalProps): JSX.Element => {
  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <ModalCardContainer
        title="Deleting a card"
        subTitle="Are you sure you want to delete the card?"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '32px',
          }}
        >
          {card && <PaymentCard last4={card.last4} brand={card.brand} />}
          <Box
            sx={{
              marginTop: '24px',
              display: 'flex',
              gap: '24px',
              width: '100%',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              justifyContent: 'center',
            }}
          >
            <Button
              sx={buttonStyle}
              variant="outlined"
              onClick={() => onDelete()}
              disabled={isLoading}
            >
              Delete
            </Button>
            <Button
              sx={buttonStyle}
              variant="outlined"
              color="error"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default DeleteCardModal;
