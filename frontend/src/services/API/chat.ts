import { CHATS } from '@/constants/api';
import { axiosAPI } from '@/lib/axios';
import { Chat, ChatMessage } from '@/types/chat';
import { PaginatedResponse } from '@/types/pagination';
import { CookieValueTypes } from 'cookies-next';

export interface GetChatMessagesResponse {
  limit: number;
  offset: number;
  total: number;
  results: {
    chatId: number;
    results: ChatMessage[];
  };
}

export interface GetChatsParams {
  filter_by?: 'all' | 'sent' | 'unread';
  q?: string;
  limit?: number;
  offset?: number;
}

export type GetChatsResponse = PaginatedResponse<{
  results: Chat[];
  unreadCount: number;
  filters: {
    sent: number;
    unread: number;
    all: number;
  };
}>;

export const getUserChats = async (
  params?: GetChatsParams,
  token?: CookieValueTypes,
) => {
  const res = await axiosAPI.get<GetChatsResponse>(CHATS.LIST, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    params,
  });
  return res.data;
};

/* export const getChatMessages = async (chatId: number) => { */
/*   const res = await axiosAPI.get<GetChatMessagesResponse>( */
/*     CHATS.MESSAGES(chatId) */
/*   ); */
/*   return res.data; */
/* }; */
