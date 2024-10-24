import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { Box } from '@mui/material';
import {
  StripeCardNumber,
  StripeCardExpiry,
  StripeCardCvc,
  type StripeCardFieldsChangeEvent,
  type StripeCardFields,
} from '@/components/stripe/StripeFields';
import {
  useStripe,
  useElements,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { Stripe, StripeCardNumberElement } from '@stripe/stripe-js';
import * as yup from 'yup';
import { FormInput } from '@/ui-kit/inputs';

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    stripe: Stripe,
    cardNumber: StripeCardNumberElement,
    cardHolder: string,
  ) => void;
  isLoading: boolean;
  cardHolderName: string;
}

type Fields = StripeCardFields | 'holderName';

const defaultFields: Record<Fields, boolean> = {
  cardNumber: false,
  cardExpiry: false,
  cardCvc: false,
  holderName: true, // true because we're asking the holderName by props
};

const defaultErrors: Record<Fields, string> = {
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  holderName: '',
};

const holderNameSchema = yup
  .string()
  .required('The holder name is required')
  .matches(/[A-Z]+$/i, 'Can"t contain any numbers or special symbols');

const AddCardModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  cardHolderName,
}: AddCardModalProps): JSX.Element => {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, setFields] = useState(defaultFields);
  const [errors, setErrors] = useState(defaultErrors);

  const holderRef = useRef<HTMLInputElement | null>(null);

  const handleChangeStripe =
    (field: Fields) => (props: StripeCardFieldsChangeEvent) => {
      setFields((prev) => ({ ...prev, [field]: props.complete }));
      setErrors((prev) => ({ ...prev, [field]: props.error?.message ?? '' }));
    };

  const handleChangeHolder = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await holderNameSchema.validate(e.currentTarget.value);

      setFields((prev) => ({ ...prev, holderName: true }));
      setErrors((prev) => ({ ...prev, holderName: '' }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        setFields((prev) => ({ ...prev, holderName: false }));
        setErrors((prev) => ({ ...prev, holderName: error.errors[0] }));
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    const cardNumber = elements.getElement(CardNumberElement);

    if (cardNumber) {
      onSubmit(stripe, cardNumber, cardHolderName);
    }
  };

  useEffect(() => {
    if (!open) {
      setFields(defaultFields);
      setErrors(defaultErrors);
    }

    return () => {
      setFields(defaultFields);
      setErrors(defaultErrors);
    };
  }, [open]);

  const isComplete = Object.values(fields).every(Boolean);
  const isDisabled = Boolean(stripe) && Boolean(stripe) && !isComplete;

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Add New Card">
        <form onSubmit={handleSubmit}>
          <div className="mt-6 flex flex-col gap-6">
            <StripeCardNumber
              id="card-number"
              label="Card Number"
              onChange={handleChangeStripe('cardNumber')}
              errorMessage={errors.cardNumber}
            />
            <FormInput
              id="card-holder"
              label="Card Holder"
              placeholder="Card Holder"
              ref={holderRef}
              defaultValue={cardHolderName}
              onChange={handleChangeHolder}
              errorMessage={errors.holderName}
            />
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
              }}
            >
              <StripeCardExpiry
                id="card-expiry"
                label="Expiry Date"
                onChange={handleChangeStripe('cardExpiry')}
                errorMessage={errors.cardExpiry}
              />
              <StripeCardCvc
                id="card-cvc"
                label="CVC"
                onChange={handleChangeStripe('cardCvc')}
                errorMessage={errors.cardCvc}
              />
            </Box>
            <div className="flex flex-col gap-3">
              <ContainedButton
                fullWidth
                type="submit"
                disabled={isDisabled}
                loading={isLoading}
              >
                Add a card
              </ContainedButton>
              <OutlinedButton fullWidth type="button" onClick={() => onClose()}>
                Cancel
              </OutlinedButton>
            </div>
          </div>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default AddCardModal;
