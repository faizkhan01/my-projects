import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ProductOptionsModalProps {
  handleAddWish: () => void;
  handleRemoveWish: () => void;
  handleSimilarProducts: () => void;
  isOpen: boolean;
  onClose: () => void;
  isWish: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '1rem 0',
  width: '100%',
  color: theme.palette.text.primary,
  fontWeight: '400',

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const ProductOptionsModal = ({
  handleAddWish,
  handleRemoveWish,
  handleSimilarProducts,
  isOpen,
  onClose,
  isWish,
}: ProductOptionsModalProps): JSX.Element => {
  const handleWish = () => {
    if (isWish) {
      handleRemoveWish();
    } else {
      handleAddWish();
    }

    onClose();
  };

  return (
    <>
      <ModalContainer
        open={isOpen}
        onClose={onClose}
        mobileFullScreen={false}
        PaperProps={{
          sx: {
            width: '100%',
            overflow: 'hidden',
          },
        }}
      >
        <ModalCardContainer
          minHeight="auto"
          cardSx={{
            padding: '0',
            pt: '18px',
          }}
        >
          <div className="flex w-full flex-col justify-center sm:flex-row">
            <StyledButton onClick={handleWish}>
              {isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </StyledButton>
            <StyledButton onClick={handleSimilarProducts}>
              Similar Product
            </StyledButton>
          </div>
        </ModalCardContainer>
      </ModalContainer>
    </>
  );
};

export default ProductOptionsModal;
