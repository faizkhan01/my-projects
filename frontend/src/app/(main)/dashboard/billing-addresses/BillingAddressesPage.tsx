'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import CustomerBilling from '@/components/dashboard/CustomerBilling';
import { ProfileData } from '@/types/user';

const BillingAddress = ({ profile }: { profile: ProfileData }) => (
  <DashboardLayout profile={profile} title="Billing address">
    <CustomerBilling profile={profile} />
  </DashboardLayout>
);

export default BillingAddress;
