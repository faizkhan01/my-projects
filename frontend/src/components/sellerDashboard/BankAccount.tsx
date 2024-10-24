'use client';
import { StripeCountryCodes } from '@/constants/stripe';
import { BankInfo } from '@/types/bank';
import { BackLinkButton, Button } from '@/ui-kit/buttons';
import { Bank } from '@phosphor-icons/react';
import { AddItemCard } from '@/ui-kit/cards';
import { MobileHeading } from '@/ui-kit/typography';
import { Divider, Tooltip, Typography } from '@mui/material';
import { cx } from 'cva';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { handleAxiosError } from '@/lib/axios';
import {
  deleteBankAccount,
  updateBankAccount,
} from '@/services/API/seller/bankInfo';
import { useRouter } from 'next/navigation';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { CurrencyCode } from '@/constants/world-currencies';

const AddBankAccountModal = dynamic(
  () => import('../modals/banks/AddBankAccountModal'),
);

interface BankAccountProps {
  bankInfo: BankInfo[];
  currenciesAndCountryOptions: Record<
    StripeCountryCodes,
    CurrencyCode[]
  > | null;
}

const BankAccountCard = ({
  bank,
  hasMoreAccounts,
  hasMoreOfSameCurrency,
}: {
  bank: BankInfo;
  hasMoreAccounts: boolean;
  hasMoreOfSameCurrency: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refresh } = useRouter();
  const currency = bank.currency.toUpperCase();
  const isDefaultForCurrency = !!bank.default_for_currency;
  const isDefaultForProfile = !!bank.profile_default_for_currency;
  const isDefaultForCurrencyAndHasMoreOfSame =
    isDefaultForCurrency && hasMoreOfSameCurrency;

  let toolTipText = '';

  if (isDefaultForProfile) {
    toolTipText = `Assign a new default bank account for currency: ${currency} to delete this bank account`;
  } else if (isDefaultForCurrencyAndHasMoreOfSame) {
    toolTipText = `Assign a new default or delete the other bank accounts with currency: ${currency} to delete this bank account`;
  }

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const { message } = await deleteBankAccount(bank.id);
      showSuccessSnackbar(message);
      refresh();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async () => {
    setIsLoading(true);

    try {
      const { message } = await updateBankAccount(bank.id, {
        defaultForCurrency: true,
      });
      showSuccessSnackbar(message);
      refresh();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cx(
        'flex flex-col justify-between gap-6 rounded-[10px] p-6',
        'shadow-[0px_0.5008620619773865px_6.636422634124756px_0px_rgba(0,0,0,0.02),0px_4px_53px_0px_rgba(0,0,0,0.04)]',
        isDefaultForProfile
          ? 'border-2 border-solid border-primary-main'
          : 'border border-solid border-[#EAECF4]',
      )}
    >
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-solid border-[#EAECF4]">
            <Bank size={24} />
          </div>
          <div className="flex flex-col">
            <Typography className="text-base/6 font-medium md:text-lg/6">
              {bank.bank_name}
            </Typography>
            <Typography className="text-xs/6 font-medium md:text-sm/6">
              Currency {currency}
            </Typography>
          </div>
        </div>
      </div>

      <Typography className="text-base/6 font-medium tracking-[4.8px] text-text-primary md:text-lg/6 md:tracking-[5.4px]">
        **** **** **** **** **{bank.last4}
      </Typography>

      <div className="flex items-center gap-4">
        <Button
          className="min-h-fit min-w-0 p-0"
          disabled={isLoading || isDefaultForCurrency}
          onClick={handleSetDefault}
        >
          {isDefaultForCurrency
            ? `Default for ${currency}`
            : `Set as Default for ${currency}`}
        </Button>
        <Divider orientation="vertical" />
        <Tooltip title={toolTipText}>
          <span>
            <Button
              className="min-h-fit min-w-0 p-0"
              color="error"
              disabled={
                isLoading ||
                isDefaultForProfile ||
                !hasMoreAccounts ||
                isDefaultForCurrencyAndHasMoreOfSame
              }
              onClick={handleDelete}
            >
              Delete
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

const BankAccount = ({
  bankInfo: banks,
  currenciesAndCountryOptions,
}: BankAccountProps) => {
  const [openAddBank, setOpenAddBank] = useState(false);

  const handleOpenModal = () => setOpenAddBank(true);

  return (
    <div>
      <BackLinkButton />
      <div className="flex items-center justify-between md:hidden">
        <MobileHeading title="Bank Accounts" />
        <Button className="min-w-0" onClick={handleOpenModal}>
          + Add
        </Button>
      </div>
      <div className="grid gap-[30px] md:grid-cols-2">
        {banks.map((bank) => (
          <BankAccountCard
            key={bank.id}
            bank={bank}
            hasMoreAccounts={banks.length > 1}
            hasMoreOfSameCurrency={
              banks.filter((b) => b.currency === bank.currency).length > 1
            }
          />
        ))}

        <AddItemCard
          className={'h-[192px]'}
          text="Add Bank Account"
          onClick={handleOpenModal}
        />
        {currenciesAndCountryOptions && (
          <AddBankAccountModal
            open={openAddBank}
            onClose={() => setOpenAddBank(false)}
            currenciesAndCountryOptions={currenciesAndCountryOptions}
          />
        )}
      </div>
    </div>
  );
};

export default BankAccount;
