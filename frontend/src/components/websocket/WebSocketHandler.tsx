'use client';
import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { SocketInstance } from '@/types/socket.interface';
import { ChatEventEnum, SocketEventEnum } from '@/types/socketEvents.enum';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';
import routes from '@/constants/routes';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import { CHATS } from '@/constants/api';
import { mutate } from 'swr';
import { GetChatMessagesResponse } from '@/services/API/chat';
import { ChatMessageStatusEnum } from '@/types/chat';
import { useChats } from '@/hooks/queries/useChats';
import { unstable_serialize } from 'swr/infinite';
import { getUseChatMessagesKey } from '@/hooks/queries/useChatMessages';
import { produce } from 'immer';
import { useAuthStore } from '@/hooks/stores/useAuthStore';

let socket: SocketInstance;

export const WebSocketHandler = () => {
  const { open: openSnackbar } = useGlobalSnackbar();
  const { profile, accessToken } = useAuthStore(
    (state) => ({
      profile: state.profile,
      accessToken: state.token,
    }),
    shallow,
  );
  const { push } = useRouter();
  const { setSocket, setTyping } = useSocketStore(
    (state) => ({
      setSocket: state.setSocket,
      setTyping: state.setTyping,
    }),
    shallow,
  );

  const setupListeners = useCallback(
    (socket: SocketInstance) => {
      // Listen to events from the server
      /* socket.on(SocketEventEnum.CONNECT, () => console.log('Connected')); */
      socket.on(SocketEventEnum.EXCEPTION, (error) => {
        openSnackbar({ message: error.message, severity: 'error' });
      });
      /* socket.on(ChatEventEnum.SUBSCRIBE_TO_CHAT, (data) => { */
      /*   console.log('SUBSCRIBE_TO_CHAT', { data }); */
      /* }); */
      socket.on(ChatEventEnum.CREATE_CHAT, (data) => {
        push(`${routes.DASHBOARD.MESSAGES.ONE(data.chatId)}`);
        mutate(CHATS.LIST);
      });

      socket.on(ChatEventEnum.TYPING, (data) => {
        setTyping(data);
      });

      socket.on(ChatEventEnum.READ_MESSAGE, (data) => {
        mutate<ReturnType<typeof useChats>['data']>(CHATS.LIST, (old) => {
          if (!old) return old;
          return {
            ...old,
            unreadCount: old.unreadCount <= 0 ? 0 : old.unreadCount--,
          };
        });
        mutate<GetChatMessagesResponse[]>(
          unstable_serialize(getUseChatMessagesKey(data.chatId)),
          (oldData) =>
            produce(oldData, (draft) => {
              if (!draft) return draft;

              draft.forEach((m) => {
                m.results.results.forEach((m) => {
                  if (m.id && data.messageIds.includes(m.id)) {
                    m.status = ChatMessageStatusEnum.READ;
                  }
                });
              });
            }),
          {
            revalidate: false,
          },
        );
      });

      socket.on(ChatEventEnum.SEND_MESSAGE, (data) => {
        mutate<ReturnType<typeof useChats>['data']>(
          CHATS.LIST,
          (old) => {
            if (!old) return old;
            const { pathname } = window.location;
            // If it's in the same messages page, don't increment the unread count
            if (pathname.includes(routes.DASHBOARD.MESSAGES.LIST)) {
              return old;
            }

            return {
              ...old,
              unreadCount:
                old.unreadCount + 1 > old.chats.length
                  ? old.chats.length
                  : old.unreadCount + 1,
            };
          },
          {
            revalidate: false,
          },
        );

        mutate<GetChatMessagesResponse[]>(
          unstable_serialize(getUseChatMessagesKey(data.chat_id)),
          (oldData) =>
            produce(oldData, (draft) => {
              if (!draft) return draft;

              draft[0].results.results.push(data);
            }),
          {
            revalidate: false,
          },
        );
      });
    },
    [openSnackbar, push, setTyping],
  );

  const startSocket = useCallback(() => {
    if (!accessToken || !profile || socket) return;
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    });

    // setup listeners
    setupListeners(socket);

    // Send events to the server
    socket.emit(ChatEventEnum.SUBSCRIBE_TO_CHAT);

    // Add socket to the store
    setSocket(socket);
  }, [accessToken, profile, setSocket, setupListeners]);

  useEffect(() => {
    startSocket();
  }, [startSocket]);

  return null;
};
