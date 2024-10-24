// https://github.com/mui/material-ui/issues/16037#issuecomment-498664873
import {
  AuBankAccountElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  FpxBankElement,
  IbanElement,
  IdealBankElement,
} from '@stripe/react-stripe-js';
import { FormInput, FormInputProps } from '@/ui-kit/inputs';
import { Box, InputBaseComponentProps } from '@mui/material';
import { useState, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { CARDS, CardType } from '@/constants/cards';

export type StripeElement =
  | typeof AuBankAccountElement
  | typeof CardCvcElement
  | typeof CardExpiryElement
  | typeof CardNumberElement
  | typeof FpxBankElement
  | typeof IbanElement
  | typeof IdealBankElement;

export type StripeCardFields = 'cardNumber' | 'cardExpiry' | 'cardCvc';

export interface StripeCardFieldsChangeEvent {
  elementType: StripeCardFields;
  complete: boolean;
  empty: boolean;
  error?: {
    message: string;
    code?: string;
  };
}

type StripeFieldProps<T extends StripeElement> = Omit<
  FormInputProps,
  'onChange' | 'inputComponent' | 'inputProps'
> & {
  inputProps?: React.ComponentProps<T>;
  onChange?: React.ComponentProps<T>['onChange'];
  stripeElement?: T;
};

const StripeInput = forwardRef<unknown, InputBaseComponentProps>(
  (props, ref) => {
    const { component: Component, options, ...other } = props;
    const [mountNode, setMountNode] = useState<HTMLInputElement | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (mountNode) {
            mountNode.focus();
          }
        },
      }),
      [mountNode],
    );

    return <Component onReady={setMountNode} options={options} {...other} />;
  },
);

StripeInput.displayName = 'StripeInput';

const StripeTextInput = <T extends StripeElement>(
  props: StripeFieldProps<T>,
): JSX.Element => {
  const { InputProps = {}, inputProps = {}, stripeElement, ...other } = props;

  return (
    <FormInput
      InputProps={{
        ...InputProps,
        inputComponent: StripeInput,
      }}
      inputProps={{
        ...inputProps,

        className: 'py-0 pb-0 h-fit',
        component: stripeElement,
      }}
      // it has to be any or it worn't work for ts
      {...(other as Record<string, unknown>)}
    />
  );
};

// Components
export function StripeCardNumber(
  props: StripeFieldProps<typeof CardNumberElement>,
): JSX.Element {
  const [brand, setBrand] = useState<CardType | null>(null);
  const onChange = props?.onChange;

  return (
    <StripeTextInput
      {...props}
      onChange={(e) => {
        if (e.brand && e.brand in CARDS) {
          // INFO: this is to show the card brand icon
          setBrand(e.brand as CardType);
        } else {
          setBrand(null);
        }

        onChange?.(e);
      }}
      stripeElement={CardNumberElement}
      endAdornment={
        brand &&
        CARDS[brand] && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image src={CARDS[brand]} width={24} height={16} alt={brand} />
          </Box>
        )
      }
    />
  );
}

export function StripeCardExpiry(
  props: StripeFieldProps<typeof CardExpiryElement>,
): JSX.Element {
  return <StripeTextInput {...props} stripeElement={CardExpiryElement} />;
}

export function StripeCardCvc(
  props: StripeFieldProps<typeof CardCvcElement>,
): JSX.Element {
  return <StripeTextInput {...props} stripeElement={CardCvcElement} />;
}
