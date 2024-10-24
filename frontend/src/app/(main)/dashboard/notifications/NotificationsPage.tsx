'use client';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import { USER_ROLES } from '@/constants/auth';
import { SellerDashboardLayout } from '@/layouts/SellerDashboardLayout';
import { useEffect, useMemo } from 'react';
import { useNotifications } from '@/hooks/queries/useNotifications';
import {
  GetNotificationsResponse,
  resetNotificationsCount,
} from '@/services/API/notifications';
import { unstable_serialize } from 'swr/infinite';
import { ProfileData } from '@/types/user';
import { SWRConfig } from 'swr';
import { getUseNotificationsKey } from '@/hooks/queries/swr-keys';

const Content = ({ profile }: { profile: ProfileData }) => {
  const { notifications: data, size, setSize } = useNotifications();

  const notifications = useMemo(() => {
    return data?.flatMap((n) => n?.results);
  }, [data]);

  const isEnd = useMemo(
    () =>
      (data?.[0]?.total ?? Number.POSITIVE_INFINITY) <=
      (notifications?.length ?? 0),
    [notifications?.length, data],
  );

  const loadMore = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    if (profile?.notificationsCount) {
      resetNotificationsCount();
    }
  }, [profile?.notificationsCount]);

  switch (profile.role) {
    case USER_ROLES.USER:
      return (
        <DashboardLayout profile={profile} title="Notifications Center">
          <NotificationCenter
            allNotifications={notifications}
            loadMore={loadMore}
            isEnd={isEnd}
          />
        </DashboardLayout>
      );
    case USER_ROLES.SELLER:
      return (
        <SellerDashboardLayout title="Notifications Center">
          <NotificationCenter
            allNotifications={notifications}
            loadMore={loadMore}
            isEnd={isEnd}
          />
        </SellerDashboardLayout>
      );
    default:
      return null;
  }
};

const NotificationPage = ({
  profile,
  notifications,
}: {
  profile: ProfileData;
  notifications: GetNotificationsResponse | null;
}) => {
  const swrNotificationsKey = unstable_serialize(getUseNotificationsKey);

  return (
    <SWRConfig
      value={{
        fallback: {
          [swrNotificationsKey]: [notifications],
        },
      }}
    >
      <Content profile={profile} />
    </SWRConfig>
  );
};

export default NotificationPage;
