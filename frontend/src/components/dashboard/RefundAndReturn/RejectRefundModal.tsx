import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { handleAxiosError } from '@/lib/axios';
import { rejectRefund } from '@/services/API/refunds';
import { RefundWithExtraData } from '@/types/refunds';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { formatPrice } from '@/utils/currency';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ObjectSchema, object, string } from 'yup';

interface RejectRefundFormData {
  reason: string;
}

const rejectRefundSchema: ObjectSchema<RejectRefundFormData> = object().shape({
  reason: string().required('The reason is required'),
});

const RejectRefundModal = ({
  refund,
  open,
  onClose,
}: {
  refund: RefundWithExtraData | null;
  open: boolean;
  onClose: () => void;
}) => {
  // We need this state because it gets removed on close
  // causing a strange animation
  const [amount, setAmount] = useState(0);
  const { refresh } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<RejectRefundFormData>({
    defaultValues: {
      reason: '',
    },
    resolver: yupResolver(rejectRefundSchema),
  });

  const handleClose = () => {
    // This is to reset all after the modal is closed
    onClose();
    setTimeout(() => {
      reset();
    }, 500);
  };

  const onSubmit: SubmitHandler<RejectRefundFormData> = async (data) => {
    if (!refund?.id) return;

    try {
      await rejectRefund(refund.id, {
        reason: data.reason,
      });
      refresh();
      handleClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    refund && setAmount(refund?.orderItem?.totalPrice ?? 0);
  }, [refund]);

  return (
    <ModalContainer open={open} onClose={handleClose} mobileFullScreen={false}>
      <ModalCardContainer
        minHeight="auto"
        title={'Reject refund'}
        titleSx={{
          fontSize: {
            xs: '20px',
            md: '40px',
          },
        }}
        removeExtraCardPadding
      >
        <form
          className="flex flex-col gap-4 md:mt-3 md:gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Typography className="text-center text-xs/5 font-medium md:text-sm">
              You really want to reject the{' '}
              {formatPrice(amount, {
                currency: refund?.currency,
              })}{' '}
              refund. <br /> This action cannot be undone
            </Typography>
            <div className="mt-2">
              <ControlledFormInput
                control={control}
                name="reason"
                label="Reason"
                placeholder="Write a reason"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <ContainedButton
              size="large"
              type="submit"
              fullWidth
              loading={isSubmitting}
            >
              Reject
            </ContainedButton>
            <OutlinedButton size="large" fullWidth onClick={handleClose}>
              Cancel
            </OutlinedButton>
          </div>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default RejectRefundModal;
