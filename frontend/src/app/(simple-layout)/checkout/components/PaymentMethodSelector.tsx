import { FormControl, RadioGroup } from '@mui/material';
import { RadioItemContainer, RadioItem } from './CheckoutRadioItem';
import { useFormContext, useWatch } from 'react-hook-form';
import { CARDS } from '@/constants/cards';
import Image from 'next/image';
import NewCardForm from './NewCardForm';
import useCustomerCards from '@/hooks/queries/customer/useCards';
import { CheckoutForm } from '../form';
import useProfile from '@/hooks/queries/useProfile';

const PaymentMethodSelector = () => {
  const { setValue, control } = useFormContext<CheckoutForm>();
  const { profile } = useProfile();
  const { cards } = useCustomerCards(Boolean(profile));
  const paymentMethod = useWatch<CheckoutForm, 'paymentMethod'>({
    name: 'paymentMethod',
    control,
  });

  const isNewCardSelected = paymentMethod === 'new_card';

  return (
    <FormControl className="w-full">
      <RadioGroup
        onChange={(e) => {
          const value = e.target.value;

          if (value === 'new_card') {
            return setValue('paymentMethod', 'new_card');
          } else {
            const foundCard = cards?.find((card) => card.id === value);

            if (foundCard) {
              setValue('paymentMethod', {
                id: foundCard.id,
              });
            }
            return;
          }
        }}
        className="flex flex-col gap-4"
      >
        <RadioItemContainer selected={isNewCardSelected}>
          <RadioItem
            text="Credit Card"
            value="new_card"
            selected={isNewCardSelected}
            sideContent={
              <div className="relative flex items-center gap-2">
                {Object.entries(CARDS).map(([name, url], index) => (
                  <Image
                    src={url}
                    alt={name}
                    key={`${name}+${index}-new-card`}
                    height={16}
                    width={24}
                  />
                ))}
              </div>
            }
          />
          {isNewCardSelected && (
            <div className="p-4">
              <NewCardForm />
            </div>
          )}
        </RadioItemContainer>
        {cards?.map((method, index) => {
          const selected =
            typeof paymentMethod === 'object' &&
            paymentMethod?.id === method?.id;

          const badge = Object.entries(CARDS).find(
            ([name]) => name === method?.card?.brand,
          );

          return (
            <RadioItemContainer
              selected={selected}
              key={`${method?.id}-${index}`}
            >
              <RadioItem
                text={`**** **** **** ${method.card.last4 ?? ''}`}
                textClassName="tracking-[5.67px]"
                sideContent={
                  badge?.[0] && (
                    <Image
                      src={badge?.[1]}
                      alt={badge?.[0]}
                      key={`${badge?.[0]}+${index}`}
                      height={16}
                      width={24}
                    />
                  )
                }
                value={method?.id}
                selected={selected}
              />
            </RadioItemContainer>
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentMethodSelector;
