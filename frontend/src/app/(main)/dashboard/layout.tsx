import { SWRProvider } from '@/components/Providers';
import { AUTH } from '@/constants/api';
import routes from '@/constants/routes';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  try {
    const token = cookies().get(cookiesKeys.TOKEN)?.value;

    if (!token) {
      return redirect(routes.INDEX);
    }

    const profile = await getProfile(token);

    if (!profile) {
      return redirect(routes.INDEX);
    }

    return (
      <SWRProvider
        options={{
          fallback: {
            [AUTH.PROFILE]: profile,
          },
        }}
      >
        {children}
      </SWRProvider>
    );
  } catch (e) {
    return redirect(routes.INDEX);
  }
};

export default Layout;
