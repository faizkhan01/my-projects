'use client';
import { GetSellerBalanceResponse } from '@/services/API/seller/balance';
import { GetSellerTransactionsResponse } from '@/services/API/transactions';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { TransactionsPage } from '@/components/sellerDashboard/TransactionsPage';
import { SellerPayout } from '@/types/sellerPayout';

const transactions = ({
  transactions,
  balance,
  payouts,
}: {
  balance: GetSellerBalanceResponse;
  payouts: SellerPayout[];
  transactions: GetSellerTransactionsResponse;
}) => {
  return (
    <SellerDashboardLayout title="Transactions">
      <TransactionsPage
        transactions={transactions}
        balance={balance}
        payouts={payouts}
      />
    </SellerDashboardLayout>
  );
};

export default transactions;
