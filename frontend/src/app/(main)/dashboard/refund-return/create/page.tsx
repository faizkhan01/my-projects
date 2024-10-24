import routes from '@/constants/routes';
import { redirect } from 'next/navigation';

const CreateRefundRedirect = () => {
  redirect(routes.DASHBOARD.REFUND_RETURN);
};

export default CreateRefundRedirect;
