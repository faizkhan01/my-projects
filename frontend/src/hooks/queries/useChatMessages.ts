import { GetChatMessagesResponse } from '@/services/API/chat';
import { CHATS } from '@/constants/api';
import useSWRInfinite from 'swr/infinite';
import { axiosAPI } from '@/lib/axios';

export const getUseChatMessagesKey =
  (chatId: number) =>
  (index: number, previousPageData: GetChatMessagesResponse) => {
    if (!chatId) {
      console.error('Please provide the chatId');
      return null;
    }

    if (previousPageData && !previousPageData.results.results.length)
      return null; // reached the end
    const limit = 20;

    return `${CHATS.MESSAGES(chatId!, { limit, offset: index * limit })}`;
  };

export const useChatMessages = (chatId: number) => {
  const { data, error, size, setSize, isValidating, isLoading } =
    useSWRInfinite(
      getUseChatMessagesKey(chatId),
      async (args) => {
        const { data } = await axiosAPI.get<GetChatMessagesResponse>(args);

        // Sort messages by createdAt, being the older ones at the end
        return {
          ...data,
          results: {
            ...data.results,
            results: data.results.results.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateA.getTime() - dateB.getTime();
            }),
          },
        };
      },
      {
        revalidateAll: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    );

  return {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
  };
};
