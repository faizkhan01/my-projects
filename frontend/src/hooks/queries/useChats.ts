import { CHATS } from '@/constants/api';
import { USER_ROLES } from '@/constants/auth';
import { GetChatsParams, getUserChats } from '@/services/API/chat';
import { StructuredChat } from '@/types/chat';
import useSWR from 'swr/immutable';
import useProfile from './useProfile';

export const useChats = (params?: GetChatsParams) => {
  const { profile } = useProfile();

  const { data, error } = useSWR(
    profile ? JSON.stringify([CHATS.LIST, params]) : null,
    async () => {
      const { limit, total, offset, results } = await getUserChats(params);
      const { results: chats, filters, unreadCount } = results;
      const sChats: StructuredChat[] =
        chats
          ?.map((chat) => {
            const chatUser =
              profile?.id === chat.creator.id ? chat.receiver : chat.creator;

            const isSeller = chatUser.role === USER_ROLES.SELLER;

            let name: string | undefined;
            let avatarUrl: string | undefined;

            if (isSeller) {
              name = chatUser.store?.name;
              avatarUrl = chatUser.store?.logo?.url;
            } else {
              name = [chatUser.firstName, chatUser.lastName]
                .filter(Boolean)
                .join(' ');
              avatarUrl = chatUser.avatar?.url;
            }

            const sChat: StructuredChat = {
              id: chat.id,
              lastMessageAt: chat.lastMessageAt,
              lastMessageText: chat.lastMessageText,
              user: {
                id: chatUser.id,
                name: name ?? '',
                avatar: avatarUrl ?? '',
                role: chatUser.role,
                storeSlug: chatUser.store?.slug,
              },
            };
            return sChat;
          })
          .sort((a, b) => {
            if (a.lastMessageAt && b.lastMessageAt) {
              return (
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime()
              );
            } else {
              return 0;
            }
          }) ?? [];

      return {
        chats: sChats,
        unreadCount,
        filters,
        pagination: {
          limit,
          offset,
          total,
        },
      };
    },
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};
