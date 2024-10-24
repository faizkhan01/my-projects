import Logo from '@/assets/icons/Logo';
import ResetPasswordPage from './ResetPasswordPage';
import Link from 'next/link';
import routes from '@/constants/routes';
import { Providers } from '@/components/Providers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Reset Password',
};

const ResetPassword = ({
  searchParams,
}: {
  searchParams: { code: string | string[] | undefined };
}) => {
  if (!searchParams.code || Array.isArray(searchParams.code)) {
    redirect(routes.INDEX);
  }

  return (
    <Providers>
      <div className="my-auto flex h-full flex-col justify-center gap-20 py-12">
        <header className="flex items-center justify-center">
          <Link href={routes.INDEX} className="flex">
            <Logo />
          </Link>
        </header>
        <main>
          <ResetPasswordPage code={searchParams.code} />
        </main>
      </div>
    </Providers>
  );
};

export default ResetPassword;
