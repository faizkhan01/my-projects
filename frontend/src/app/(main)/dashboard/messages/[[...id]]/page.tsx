import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { cookies } from 'next/headers';
import MessagesPage from './MessagesPage';

export const metadata = {
  title: 'Messages',
};

const Messages = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const profile = await getProfile(accessToken);

  return <MessagesPage profile={profile} />;
};

export default Messages;
