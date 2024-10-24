import routes from '@/constants/routes';
import { redirect } from 'next/navigation';

export async function GET() {
  return redirect(routes.DASHBOARD.INDEX);
}
