import { PaymentCard } from './PaymentCard';
import DeleteCardModal from '@/components/modals/cards/DeleteCardModal';
import AddCardModal from '@/components/modals/cards/AddCardModal';
import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { handleAxiosError } from '@/lib/axios';
import {
  createCustomerCardIntent,
  deleteCustomerCard,
} from '@/services/API/cards';
import type { PaymentMethod } from '@/types/paymentMethods';
import { Stripe, StripeCardNumberElement } from '@stripe/stripe-js';
import useCustomerCards from '@/hooks/queries/customer/useCards';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import useProfile from '@/hooks/queries/useProfile';
import { BackLinkButton } from '@/ui-kit/buttons';
import { AddItemCard } from '@/ui-kit/cards';
import { MobileHeading } from '@/ui-kit/typography';
import { CardType } from '@/constants/cards';

export const PaymentMethodsPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<
    PaymentMethod['id'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cards, mutate } = useCustomerCards();
  const { profile } = useProfile();

  const openSnackbar = useGlobalSnackbar((state) => state.open);

  const handleAddCard = async (
    stripe: Stripe,
    cardNumber: StripeCardNumberElement,
    cardHolder: string,
  ) => {
    setIsLoading(true);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: {
        name: cardHolder,
      },
    });

    if (error) {
      openSnackbar({
        severity: 'error',
        message: error.message,
      });
      setIsLoading(false);
      return;
    }

    if (!paymentMethod?.id) {
      return;
    }

    try {
      const { data } = await createCustomerCardIntent(paymentMethod.id);

      const result = await stripe.confirmCardSetup(data.client_secret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        openSnackbar({
          severity: 'error',
          message: result.error.message,
        });
        return;
      }

      if (result.setupIntent.status === 'succeeded') {
        openSnackbar({
          severity: 'success',
          message: 'Card added successfully',
        });
        setIsAdding(false);
        mutate();
      }
    } catch (e) {
      handleAxiosError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCardId) return;
    setIsLoading(true);
    try {
      const { message } = await deleteCustomerCard(selectedCardId);
      mutate(
        (data) => {
          return data?.filter((card) => card.id !== selectedCardId);
        },
        {
          revalidate: false,
        },
      );
      openSnackbar({
        severity: 'success',
        message,
      });
      setIsDeleting(false);
    } catch (e) {
      handleAxiosError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCard =
    cards?.find((card) => card.id === selectedCardId)?.card ?? null;

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Payment Methods" />
      <Grid container spacing={'30px'} alignItems="flex-start">
        {cards?.map(({ card, id }) => {
          return (
            <Grid item key={card.fingerprint} xs={12} sm={6} xl={4}>
              <PaymentCard
                key={card.fingerprint}
                last4={card.last4}
                brand={card.brand as CardType}
                onDelete={() => {
                  setSelectedCardId(id);
                  setIsDeleting(true);
                }}
              />
            </Grid>
          );
        })}
        <Grid item xs={12} sm={6} xl={4}>
          <AddItemCard
            onClick={() => {
              setIsAdding(true);
            }}
            className="h-[120px] min-w-[270px]"
            text="Add New Card"
          />
        </Grid>
      </Grid>
      <DeleteCardModal
        open={isDeleting}
        onClose={() => setIsDeleting(false)}
        onDelete={handleDeleteCard}
        card={selectedCard}
        isLoading={isLoading}
      />
      {profile && (
        <AddCardModal
          open={isAdding}
          onClose={() => setIsAdding(false)}
          onSubmit={handleAddCard}
          isLoading={isLoading}
          cardHolderName={
            `${profile?.firstName} ${profile?.lastName}`.trim() || ''
          }
        />
      )}
    </Box>
  );
};
