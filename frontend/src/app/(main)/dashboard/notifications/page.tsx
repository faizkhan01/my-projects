import { USER_ROLES } from '@/constants/auth';
import { cookiesKeys } from '@/lib/cookies';
import { getProfile } from '@/services/API/auth/profile';
import { getNotifications } from '@/services/API/notifications';
import { dashboardIndexRedirect } from '@/utils/redirects';
import { cookies } from 'next/headers';
import NotificationsPage from './NotificationsPage';
import { getUseNotificationsKey } from '@/hooks/queries/swr-keys';

export const metadata = {
  title: 'Notifications',
};

const Notifications = async () => {
  const accessToken = cookies().get(cookiesKeys.TOKEN)?.value;

  const notificationsKey = getUseNotificationsKey(0, null)?.toString();
  const [profile, notifications] = await Promise.all([
    getProfile(accessToken),
    notificationsKey ? getNotifications(notificationsKey, accessToken) : null,
  ]);

  if (profile.role !== USER_ROLES.USER && profile.role !== USER_ROLES.SELLER) {
    return dashboardIndexRedirect();
  }

  return <NotificationsPage profile={profile} notifications={notifications} />;
};

export default Notifications;
