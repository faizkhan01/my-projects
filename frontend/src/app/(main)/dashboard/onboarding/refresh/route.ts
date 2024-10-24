import { USER_ROLES } from '@/constants/auth';
import routes from '@/constants/routes';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getSellerOnboardingLink } from '@/services/API/seller/onboarding/onboarding';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const token = cookies().get(cookiesKeys.TOKEN)?.value;

  if (!token) {
    return redirect(routes.INDEX);
  }

  const profile = await getProfile(token);

  if (profile?.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  const result = await getSellerOnboardingLink(token);

  return redirect(result.url);
}
