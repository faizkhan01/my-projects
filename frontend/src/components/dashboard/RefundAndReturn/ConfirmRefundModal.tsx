import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { handleAxiosError } from '@/lib/axios';
import { confirmRefund } from '@/services/API/refunds';
import { RefundWithExtraData } from '@/types/refunds';
import { ContainedButton, OutlinedButton, Button } from '@/ui-kit/buttons';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { formatPrice, getCurrencySymbol } from '@/utils/currency';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ObjectSchema, object, number, ref, string } from 'yup';

interface ConfirmRefundFormData {
  reason: string;
  amount: number | string;
  maxAmount: number;
}

const confirmRefundSchema: ObjectSchema<ConfirmRefundFormData> = object().shape(
  {
    amount: number()
      .transform((v: string | number) => (isNaN(Number(v)) ? undefined : v))
      .min(1, 'The amount must be greater than 0')
      .max(
        ref('maxAmount'),
        'The amount must be less than or equal to the max amount',
      )
      .required('Please enter the amount'),
    reason: string().required('The reason is required'),
    maxAmount: number().required(),
  },
);

const ConfirmRefundModal = ({
  refund,
  open,
  onClose,
}: {
  refund: RefundWithExtraData | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [status, setStatus] = useState<'FORM' | 'CONFIRMED'>('FORM');
  const { refresh } = useRouter();
  const total = refund?.orderItem?.totalPrice ?? 0;
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<ConfirmRefundFormData>({
    values: {
      amount: total,
      reason: '',
      maxAmount: total,
    },
    resolver: yupResolver(confirmRefundSchema),
  });

  const onSubmit: SubmitHandler<ConfirmRefundFormData> = async (data) => {
    const nAmount = Number(data.amount);
    if (!refund?.id) return;

    try {
      await confirmRefund(refund.id, {
        amount: nAmount,
        reason: data.reason,
      });
      setStatus('CONFIRMED');
      refresh();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClose = () => {
    onClose();

    // This is to reset all after the modal is closed
    setTimeout(() => {
      reset();
      setStatus('FORM');
    }, 500);
  };

  const title = useMemo(() => {
    if (status === 'CONFIRMED') {
      return 'Refund is confirmed';
    }

    return 'Confirm refund';
  }, [status]);

  return (
    <ModalContainer open={open} onClose={handleClose} mobileFullScreen={false}>
      <ModalCardContainer
        minHeight="auto"
        title={title}
        titleSx={{
          fontSize: {
            xs: '20px',
            md: '40px',
          },
        }}
        removeExtraCardPadding
      >
        {status === 'FORM' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4 flex flex-col gap-6 md:mt-6">
              <div className="flex flex-col gap-4">
                <ControlledFormInput
                  control={control}
                  name="amount"
                  placeholder="Enter amount"
                  label="Amount"
                  helperText={`Max amount is ${formatPrice(total)}`}
                  startAdornment={
                    refund?.currency
                      ? getCurrencySymbol({ currency: refund?.currency })
                      : undefined
                  }
                  endAdornment={
                    <Button
                      className="min-w-fit"
                      onClick={() => setValue('amount', total)}
                    >
                      All Amount
                    </Button>
                  }
                  type="number"
                />
                <ControlledFormInput
                  control={control}
                  name="reason"
                  placeholder="Write the reason"
                  helperText="This will be sent to the customer"
                  label="Reason"
                />
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                <ContainedButton
                  size="large"
                  fullWidth
                  type="submit"
                  loading={isSubmitting}
                >
                  Confirm
                </ContainedButton>
                <OutlinedButton size="large" fullWidth onClick={handleClose}>
                  Cancel
                </OutlinedButton>
              </div>
            </div>
          </form>
        )}

        {status === 'CONFIRMED' && (
          <div className="flex flex-col gap-4 md:mt-3 md:gap-10">
            <Typography className="text-center text-xs/5 font-medium md:text-sm">
              Refunds processed promptly. <br /> You&apos;ll receive a
              notification upon completion.
            </Typography>
            <div className="flex w-full justify-center">
              <ContainedButton
                fullWidth
                size="large"
                className="max-w-[173px]"
                onClick={handleClose}
              >
                OK
              </ContainedButton>
            </div>
          </div>
        )}
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default ConfirmRefundModal;
