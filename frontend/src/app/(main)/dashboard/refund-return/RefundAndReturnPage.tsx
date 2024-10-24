'use client';
import { USER_ROLES } from '@/constants/auth';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import RefundAndReturn from '@/components/dashboard/RefundAndReturn';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { ProfileData } from '@/types/user';
import { RefundWithExtraData } from '@/types/refunds';

const RefundReturn = ({
  profile,
  allRefunds,
}: {
  profile: ProfileData;
  allRefunds: RefundWithExtraData[];
}) => {
  switch (profile.role) {
    case USER_ROLES.USER:
      return (
        <DashboardLayout profile={profile} title="Refund and return">
          <RefundAndReturn allRefunds={allRefunds} role={profile.role} />
        </DashboardLayout>
      );
    case USER_ROLES.SELLER:
      return (
        <SellerDashboardLayout title="Refund and return">
          <RefundAndReturn allRefunds={allRefunds} role={profile.role} />
        </SellerDashboardLayout>
      );
    default:
      return null;
  }
};

export default RefundReturn;
