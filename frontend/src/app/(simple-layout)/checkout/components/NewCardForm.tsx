import { Grid } from '@mui/material';
import {
  StripeCardNumber,
  StripeCardExpiry,
  StripeCardCvc,
  type StripeCardFieldsChangeEvent,
} from '@/components/stripe/StripeFields';
import { useFormContext } from 'react-hook-form';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { FieldPath } from 'react-hook-form';
import { CheckoutForm } from '../form';

const NewCardForm = () => {
  const {
    control,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<CheckoutForm>();

  const onChangeCards = (e: StripeCardFieldsChangeEvent) => {
    let formField: FieldPath<CheckoutForm>;

    switch (e.elementType) {
      case 'cardNumber':
        formField = 'card.number';
        break;
      case 'cardExpiry':
        formField = 'card.expiry';
        break;
      case 'cardCvc':
        formField = 'card.cvc';
        break;
    }

    setValue(formField, e);

    // This is to show specific errors from stripe validations
    if (e.error) {
      return setError(formField, {
        type: e.error.code,
        message: e.error.message,
      });
    } else if (!e.empty && e.complete) {
      return clearErrors(formField);
    }
  };

  const cardErrors = errors?.card;

  return (
    <Grid spacing={'30px'} container>
      <Grid item xs={12} sm={6}>
        <StripeCardNumber
          id="Card"
          label="Card Number"
          onChange={onChangeCards}
          errorMessage={
            cardErrors?.number?.message ||
            cardErrors?.number?.empty?.message ||
            cardErrors?.number?.complete?.message
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ControlledFormInput
          id="Holder"
          label="Card Holder"
          name="card.holder"
          placeholder="Card holder name"
          control={control}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StripeCardExpiry
          id="Expiry"
          label="Expiry Date"
          onChange={onChangeCards}
          errorMessage={
            cardErrors?.expiry?.message ||
            cardErrors?.expiry?.empty?.message ||
            cardErrors?.expiry?.complete?.message
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StripeCardCvc
          id="CVC"
          label="CVC"
          onChange={onChangeCards}
          errorMessage={
            cardErrors?.cvc?.message ||
            cardErrors?.cvc?.empty?.message ||
            cardErrors?.cvc?.complete?.message
          }
        />
      </Grid>
    </Grid>
  );
};

export default NewCardForm;
