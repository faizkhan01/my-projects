'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import Shipping from '@/components/dashboard/Shipping';
import { ProfileData } from '@/types/user';

const ShippingAddress = ({ profile }: { profile: ProfileData }) => (
  <DashboardLayout profile={profile} title="Shipping address">
    <Shipping profile={profile} />
  </DashboardLayout>
);

export default ShippingAddress;
