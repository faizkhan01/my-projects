import { DashboardLayout } from '@/layouts/DashboardLayout';
import CreateRefundAndReturn from '@/components/dashboard/CreateRefundAndReturn';
import { OrderItemWithOrder } from '@/types/orders';
import { ProfileData } from '@/types/user';

const CreateRefundReturn = ({
  profile,
  orderItem,
}: {
  orderItem: OrderItemWithOrder;
  profile: ProfileData;
}) => (
  <DashboardLayout profile={profile} title="Refund and return">
    <CreateRefundAndReturn orderItem={orderItem} />
  </DashboardLayout>
);

export default CreateRefundReturn;
