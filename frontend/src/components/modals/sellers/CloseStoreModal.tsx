import routes from '@/constants/routes';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { handleAxiosError } from '@/lib/axios';
import { closeStore } from '@/services/API/seller/settings';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { Typography } from '@mui/material';
import { useState } from 'react';

const CloseStoreModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    try {
      const { message } = await closeStore();

      showSuccessSnackbar(message);
      setSuccess(true);

      setTimeout(() => {
        window.location.href = routes.INDEX;
      }, 1500);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalContainer open={open} onClose={onClose} mobileFullScreen={false}>
      <ModalCardContainer
        title="Close your shop"
        minHeight="auto"
        removeExtraCardPadding
      >
        <div className="flex flex-col items-center gap-4 md:mt-3 md:gap-10">
          <Typography className="max-w-sm text-center text-xs/5 font-medium md:text-sm">
            Are you sure you want to close your shop? <br />
            This action cannot be undone and you will not be able to access your
            account anymore.
          </Typography>

          <div className="flex w-full flex-col gap-3 md:flex-row md:gap-6">
            <ContainedButton
              size="large"
              fullWidth
              loading={loading}
              disabled={success}
              onClick={onConfirm}
            >
              Close shop
            </ContainedButton>
            <OutlinedButton
              disabled={loading || success}
              size="large"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </OutlinedButton>
          </div>
        </div>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default CloseStoreModal;
