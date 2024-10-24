import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { Box, Typography, Stack } from '@mui/material';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';

interface DeleteProductDialogProps {
  isLoading: boolean;
  open: boolean;
  onClose: () => void;
  confirmDelete: () => void;
}

const DeleteProductDialog = ({
  isLoading,
  open,
  onClose,
  confirmDelete,
}: DeleteProductDialogProps) => {
  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer
        title="Are you sure you want to delete this product?"
        titleSx={{
          fontSize: '18px',
          textAlign: 'left',
        }}
        minHeight="auto"
      >
        <Stack spacing={3} sx={{ pt: 3, height: '100%' }}>
          <Typography>
            No one will be able to buy this product. <br />
            This action can&apos;t be undone
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              rowGap: 1,
              columnGap: 2,
              mt: 'auto',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <ContainedButton
              fullWidth
              color="error"
              onClick={confirmDelete}
              loading={isLoading}
            >
              Confirm
            </ContainedButton>
            <OutlinedButton onClick={onClose} fullWidth>
              Cancel
            </OutlinedButton>
          </Box>
        </Stack>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default DeleteProductDialog;
