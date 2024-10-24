'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PaymentMethodsPage } from '@/components/dashboard/paymentMethods/PaymentMethodsPage';
import { ProfileData } from '@/types/user';

const PaymentMethods = ({ profile }: { profile: ProfileData }) => (
  <DashboardLayout profile={profile} title="Payment Methods">
    <PaymentMethodsPage />
  </DashboardLayout>
);

export default PaymentMethods;
