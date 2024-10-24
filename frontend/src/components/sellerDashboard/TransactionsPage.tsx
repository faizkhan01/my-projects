import * as yup from 'yup';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { upperFirst } from 'lodash';
import TabList from '@mui/lab/TabList';
import routes from '@/constants/routes';
import { Balance } from '@/types/balance';
import {
  DataGridColDef,
  DataGridToolbarProps,
  MobileDataTable,
  NewDataTable,
} from '@/ui-kit/tables';
import TabContext from '@mui/lab/TabContext';
import { Plus } from '@phosphor-icons/react';
import { SearchInput } from '@/ui-kit/inputs';
import { styled } from '@mui/material/styles';
import { handleAxiosError } from '@/lib/axios';
import { Transaction } from '@/types/transactions';
import { SellerPayout } from '@/types/sellerPayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { formatPrice, getCurrencySymbol } from '@/utils/currency';
import {
  Control,
  SubmitHandler,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { Box, Link, Tooltip, Tab, Typography } from '@mui/material';
import { GetSellerBalanceResponse } from '@/services/API/seller/balance';
import { GetSellerTransactionsResponse } from '@/services/API/transactions';
import { requestPayout } from '@/services/API/payouts';
import {
  BackLinkButton,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import {
  ConditionalWrapper,
  ModalCardContainer,
  ModalContainer,
} from '@/ui-kit/containers';
import { ControlledFormSelect } from '../hookForm/ControlledFormSelect';
import { MenuItem } from '@/ui-kit/menu';
import { useSellerBankAccounts } from '@/hooks/queries/seller/useSellerBankAccounts';
import useCountries from '@/hooks/queries/useCountries';
import { getCountryFromList } from '@/utils/countries';

interface TransactionsPageProps {
  transactions: GetSellerTransactionsResponse;
  balance: GetSellerBalanceResponse;
  payouts: SellerPayout[];
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
interface TransactionsToolbarProps extends DataGridToolbarProps<any> {
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  value: string;
  type: 'payouts' | 'transactions';
}

interface RequestPayoutModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: Balance;
}

interface FormValues {
  amount: number;
  currency: string;
  bankId: string;
}

const BoxStyle = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  backgroundColor: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  marginBottom: '96px',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '60px',
  },
  mt: '40px',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '18px',
  '&.Mui-selected': {
    color: theme.palette.text.primary,
  },
}));

const PayoutModalBankAccountField = ({
  control,
  setValue,
}: {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) => {
  const { bankAccounts } = useSellerBankAccounts();
  const { countries } = useCountries();

  useEffect(() => {
    if (bankAccounts) {
      setValue(
        'bankId',
        bankAccounts?.find(
          (bank) =>
            bank.profile_default_for_currency || bank.default_for_currency,
        )?.id || '',
      );
    }
  }, [bankAccounts, setValue]);

  return (
    <div>
      <ControlledFormSelect
        id="bank"
        label="Bank Account"
        control={control}
        name="bankId"
        SelectProps={{
          displayEmpty: true,
        }}
      >
        <MenuItem value="" disabled>
          Select a bank account
        </MenuItem>
        {bankAccounts?.map((bank) => {
          const foundCountry = getCountryFromList(
            countries || [],
            bank.country,
          );
          return (
            <MenuItem
              key={bank.id}
              value={bank.id}
              disabled={
                bank.status === 'errored' ||
                bank.status === 'verification_failed'
              }
            >
              <span className="flex items-center">
                {foundCountry && (
                  <span
                    role="img"
                    className="mr-4"
                    aria-label={foundCountry?.name}
                  >
                    {foundCountry?.emoji}
                  </span>
                )}

                <span>
                  {bank.bank_name} - {bank.last4} -{' '}
                  {bank.currency?.toUpperCase()}
                </span>
              </span>
            </MenuItem>
          );
        })}
      </ControlledFormSelect>
    </div>
  );
};

const RequestPayoutModal = ({
  open,
  onClose,
  availableBalance,
}: RequestPayoutModalProps) => {
  const amount = availableBalance.amount ? availableBalance.amount / 100 : 0;
  const schema = yup.object({
    amount: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required('Please enter an amount')
      .positive('Please enter an amount greater than 0')
      .max(
        amount,
        'Please enter an amount less than or equal to your available balance',
      ),
    currency: yup.string().required('Please select a currency'),
    bankId: yup.string().required('Please select a bank account'),
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      amount,
      currency: availableBalance.currency,
      bankId: '',
    },
    resolver: yupResolver(schema),
  });

  const currency = watch('currency');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await requestPayout({
        amount: data.amount,
        currency: data.currency,
        bankAccountId: data.bankId,
      });
      showSuccessSnackbar(res.message);
      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer
        title="Request Payout"
        subTitle={`Available Balance: ${formatPrice(amount, {
          currency,
        })}`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col gap-8 pt-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <ControlledFormInput
                label="Amount"
                type="number"
                control={control}
                name="amount"
                placeholder="Enter amount"
                startAdornment={
                  <div className="flex items-center">
                    {currency &&
                      getCurrencySymbol({ locale: 'en-US', currency })}
                  </div>
                }
              />
            </div>
            <PayoutModalBankAccountField
              control={control}
              setValue={setValue}
            />
          </div>
          <div className="mt-auto flex gap-4 md:gap-6">
            <ContainedButton
              type="submit"
              fullWidth
              size="large"
              loading={isSubmitting}
            >
              Confirm
            </ContainedButton>

            <OutlinedButton fullWidth onClick={onClose} size="large">
              Cancel
            </OutlinedButton>
          </div>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

const getTransactionStatusData = (transaction: Transaction) => {
  let status;
  let statusColor;
  const hasRefunds = transaction.amountRefunded > 0;
  const isFullyRefunded = transaction.amountRefunded === transaction.amount;

  if (!hasRefunds && transaction.status === 'failed') {
    status = 'Failed';
    statusColor = 'bg-error-main';
  }
  if (!hasRefunds && transaction.status === 'pending') {
    status = 'Pending payment';
    statusColor = 'bg-warning-main';
  }
  if (!hasRefunds && transaction.status === 'succeeded') {
    status = 'Paid';
    statusColor = 'bg-primary-main';
  }

  if (hasRefunds && !isFullyRefunded) {
    status = 'Partially refunded';
    statusColor = 'bg-warning-main';
  } else if (hasRefunds && isFullyRefunded) {
    status = 'Refunded';
    statusColor = 'bg-error-main';
  }

  return {
    status,
    statusColor,
  };
};

const COLUMN_IDS = {
  payouts: 'payoutId',
  transactions: 'transactionId',
};

const getTransactionStatusCell = (data: Transaction) => {
  const { status, statusColor } = getTransactionStatusData(data);
  return (
    <div className="flex items-center gap-1">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor}`}
      />
      <Typography
        component="span"
        sx={{
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '18px',
        }}
      >
        {upperFirst(status)}
      </Typography>
    </div>
  );
};

const transactionColumns: DataGridColDef<Transaction>[] = [
  {
    accessorFn: (row) => row?.orderNumber || row?.orderId,
    id: COLUMN_IDS.transactions,
    header: 'Order Number',
    size: 150,
    cell: ({ row, getValue }) => (
      <Link
        component={NextLink}
        href={routes.SELLER_DASHBOARD.ORDERS.INFO(row.original.orderId)}
        color="text.primary"
      >
        #{getValue() as string}
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.amount / 100,
    header: 'Price',
    cell: (params) => {
      const amount = params.getValue() as number;
      return formatPrice(amount, {
        currency: params.row.original.currency,
        currencyDisplay: 'narrowSymbol',
      });
    },
  },
  {
    accessorFn: (row) => (row.amount - row.amountRefunded - row.fees) / 100,
    header: 'Earned',
    cell: (params) => {
      const amount = params.getValue() as number;
      return formatPrice(amount, {
        currency: params.row.original.currency,
        currencyDisplay: 'narrowSymbol',
      });
    },
  },
  {
    accessorFn: (row) => row.amountRefunded / 100,
    header: 'Refund',
    cell: (params) => {
      const refundedAmount = params.getValue() as number;
      const formattedRefundedAmount = formatPrice(refundedAmount, {
        currencyDisplay: 'narrowSymbol',
        currency: params.row.original.currency,
      });
      return `${formattedRefundedAmount}`;
    },
  },
  {
    accessorFn: (row) => row.fees / 100,
    header: 'Fees',
    cell: (params) => {
      const fees = params.getValue() as number;
      const formattedFees = formatPrice(fees, {
        currencyDisplay: 'narrowSymbol',
        currency: params.row.original.currency,
      });
      return `-${formattedFees}`;
    },
  },
  {
    accessorFn: (row) => dayjs(row.created).format('MMM DD[,] YYYY'),
    header: 'Date',
  },
  {
    accessorFn: (row) => {
      const { status } = getTransactionStatusData(row);
      return status;
    },
    header: 'Status',
    cell: ({ row }) => getTransactionStatusCell(row.original),
  },
];

const payoutsColumns: DataGridColDef<SellerPayout>[] = [
  {
    id: COLUMN_IDS.payouts,
    header: 'ID',
    accessorFn: (row) => row.id?.toString(),
    cell: (params) => `#${params.getValue()}`,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    cell: (params) =>
      formatPrice(params.getValue() as number, {
        currency: params.row.original.currency,
        currencyDisplay: 'narrowSymbol',
      }),
  },
  {
    id: 'currency',
    header: 'Currency',
    accessorKey: 'currency',
    cell: (params) => (params.getValue() as string)?.toUpperCase(),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (params) => {
      const value = params.row.original.status;
      let statusColor = 'primary';

      switch (value) {
        case 'PENDING':
          statusColor = 'bg-warning-main';
          break;
        case 'CONFIRMED':
          statusColor = 'bg-success-main';
          break;
        case 'CANCELLED':
        case 'REJECTED':
          statusColor = 'bg-error-main';
          break;
      }

      return (
        <div className="flex items-center gap-1">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor}`}
          />
          <Typography
            component="span"
            sx={{
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '18px',
            }}
          >
            {upperFirst(value.toLowerCase())}
          </Typography>
        </div>
      );
    },
  },
  {
    id: 'arrivalDate',
    header: 'Arrival Date',
    accessorFn: (row) =>
      row.arrivalDate ? dayjs(row.arrivalDate).format('MMM DD[,] YYYY') : '',
  },
  {
    id: 'confirmedAt',
    header: 'Confirmed/Rejected Date',
    accessorFn: (row) => {
      const date: Date | null = row.confirmedAt ?? row.rejectedAt;
      return date ? dayjs(date).format('MMM DD[,] YYYY') : '';
    },
  },
];

const TransactionsToolbar = ({
  handleChange,
  value,
  table,
  type,
}: TransactionsToolbarProps) => {
  const label =
    type === 'payouts'
      ? 'Enter the number of payout'
      : 'Enter the number of order';

  const column = table.getColumn(
    type === 'payouts' ? COLUMN_IDS.payouts : COLUMN_IDS.transactions,
  );

  const searchValue = column?.getFilterValue();

  return (
    <>
      <div className="flex flex-wrap items-center gap-6 pb-6 md:p-6">
        <div className="flex-grow-[2] rounded-[4px]">
          <SearchInput
            value={searchValue || ''}
            sx={{ height: '40px', width: '100%' }}
            label={label}
            placeholder={label}
            onChange={(e) => {
              column?.setFilterValue(e.target.value);
            }}
            hideSearchButton
          />
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            typography: 'body1',
            height: '40px',
            width: {
              md: '50%',
              xs: '100%',
            },
          }}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="transactions and payouts tabs"
              >
                <StyledTab label="Transactions" value="1" />
                <StyledTab label="Payouts" value="2" />
              </TabList>
            </Box>
          </TabContext>
        </Box>
      </div>
    </>
  );
};

export const TransactionsPage = ({
  transactions,
  balance,
  payouts,
}: TransactionsPageProps) => {
  const [openPayout, setOpenPayout] = useState(false);
  const [value, setValue] = useState('1');
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const availableBalance = useMemo(
    () =>
      balance?.available.find((b) => b.amount !== 0) || balance?.available?.[0],
    [balance],
  );

  return (
    <>
      <BackLinkButton />
      <RequestPayoutModal
        open={openPayout}
        onClose={() => setOpenPayout(false)}
        availableBalance={availableBalance}
      />
      <div className="my-4 flex justify-end">
        <ConditionalWrapper
          condition={availableBalance?.amount === 0}
          wrapper={(c) => (
            <Tooltip title="You don't have any available balance to request payout">
              <div>{c}</div>
            </Tooltip>
          )}
        >
          <ContainedButton
            disabled={availableBalance?.amount === 0}
            startIcon={<Plus size={18} />}
            onClick={() => setOpenPayout(true)}
          >
            Request Payout
          </ContainedButton>
        </ConditionalWrapper>
      </div>

      <BoxStyle>
        {value === '1' ? (
          <>
            <NewDataTable
              slots={{
                toolbar: (props: DataGridToolbarProps<Transaction>) => {
                  return (
                    <TransactionsToolbar
                      handleChange={handleChange}
                      value={value}
                      type="transactions"
                      {...props}
                    />
                  );
                },
              }}
              columns={transactionColumns}
              data={transactions?.data}
              hideOnMobile
              getRowHeight={() => 60}
              tableHeight={600}
            />
            <MobileDataTable
              columnNumber={4}
              columnsSpaceBetween={true}
              columns={transactionColumns}
              data={transactions?.data}
              slots={{
                toolbar: (props: DataGridToolbarProps<Transaction>) => (
                  <TransactionsToolbar
                    handleChange={handleChange}
                    value={value}
                    type="transactions"
                    {...props}
                  />
                ),
              }}
            />
          </>
        ) : (
          <>
            <NewDataTable
              slots={{
                toolbar: (props: DataGridToolbarProps<SellerPayout>) => (
                  <TransactionsToolbar
                    handleChange={handleChange}
                    value={value}
                    type="payouts"
                    {...props}
                  />
                ),
              }}
              columns={payoutsColumns}
              data={payouts}
              hideOnMobile
              getRowHeight={() => 60}
              tableHeight={600}
            />
            <MobileDataTable
              columnNumber={2}
              columns={payoutsColumns}
              data={payouts}
              slots={{
                toolbar: (props: DataGridToolbarProps<SellerPayout>) => (
                  <TransactionsToolbar
                    handleChange={handleChange}
                    value={value}
                    type="payouts"
                    {...props}
                  />
                ),
              }}
            />
          </>
        )}
      </BoxStyle>
    </>
  );
};
