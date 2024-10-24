import * as yup from 'yup';
import { Box } from '@mui/material';
import { handleAxiosError } from '@/lib/axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { reportsSellerModal } from '@/services/API/seller/reportsSellerModal';

interface ReportSellerModalProps {
  open: boolean;
  onClose: () => void;
  storeId: number;
}

export interface ReportSellerModalForm {
  subject: string;
  description: string;
  sellerId: number;
}

const formSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  description: yup.string().required('Description is required'),
});

const defaultValues = {
  subject: '',
  description: '',
};

const ReportSellerModal = ({
  open,
  onClose,
  storeId,
}: ReportSellerModalProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReportSellerModalForm>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<ReportSellerModalForm> = async (data) => {
    try {
      const fromData = { ...data, storeId };
      const response = await reportsSellerModal(fromData);
      showSuccessSnackbar(response.message);
      reset();
      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Report seller">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '24px',
              maxWidth: '370px',
              marginInline: 'auto',
            }}
          >
            <ControlledFormInput
              id="subject"
              name="subject"
              type="subject"
              control={control}
              label="Subject"
              placeholder="Subject"
            />
            <ControlledFormInput
              id="describe-your-problem"
              label="Describe Your Problem"
              type="text"
              rows={7}
              multiline={true}
              placeholder="What issue would you like to report?"
              control={control}
              name="description"
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '24px',
                flexWrap: 'wrap',
                gap: {
                  xs: '12px',
                  md: '24px',
                },
              }}
            >
              <ContainedButton
                size="large"
                className="h-12 w-full max-w-full sm:max-w-[173px]"
                type="submit"
                loading={isSubmitting}
              >
                Submit
              </ContainedButton>
              <OutlinedButton
                size="large"
                fullWidth
                className="h-12 w-full max-w-full sm:max-w-[173px]"
                onClick={() => handleClose()}
              >
                Cancel
              </OutlinedButton>
            </Box>
          </Box>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default ReportSellerModal;
