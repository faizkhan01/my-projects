import { cookiesKeys } from '@/lib/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = cookies();
  cookieStore.delete(cookiesKeys.TOKEN);

  return redirect('/');
}
