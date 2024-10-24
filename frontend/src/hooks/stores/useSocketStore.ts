import { Chat } from '@/types/chat';
import { ClientToServerEvents, SocketInstance } from '@/types/socket.interface';
import { ChatEventEnum } from '@/types/socketEvents.enum';
import { create } from 'zustand';
import { produce } from 'immer';

export interface SocketStoreState {
  socket: SocketInstance | null;
  setSocket: (socket: SocketInstance) => void;

  chats: Chat[] | null;
  typing: Record<number, { name: string; chatId: number }> | null;

  createChat: (data: Parameters<ClientToServerEvents['createChat']>[0]) => void;
  sendMessage: (data: {
    chat: number;
    to: number;
    body: string;
    file?: File;
  }) => void;
  sendTyping: (data: Parameters<ClientToServerEvents['typing']>[0]) => void;
  setTyping: (data: { name: string; to: number; chatId: number }) => void;
  clearTyping: (data: { chatId: number }) => void;
  readMessages: (
    data: Parameters<ClientToServerEvents['readMessage']>[0],
  ) => void;
}

export const useSocketStore = create<SocketStoreState>((set, get) => ({
  socket: null,
  setSocket: (socket) => set((state) => ({ ...state, socket })),

  chats: null,
  typing: null,

  createChat: (data) => {
    const { socket } = get();
    socket?.emit(ChatEventEnum.CREATE_CHAT, data);
  },
  readMessages: (data) => {
    const { socket } = get();
    socket?.emit(ChatEventEnum.READ_MESSAGE, data);
  },
  sendTyping: (data) => {
    const { socket } = get();
    socket?.emit(ChatEventEnum.TYPING, data);
  },
  setTyping: (data) => {
    set(
      produce((state) => {
        if (state?.typing === null) {
          state.typing = {};
        }
        state.typing[data.chatId] = { chatId: data.chatId, name: data.name };
      }),
    );
  },
  clearTyping: (data) => {
    set(
      produce((state) => {
        delete state.typing[data.chatId];
      }),
    );
  },
  sendMessage: (data) => {
    const { socket } = get();

    socket?.emit(ChatEventEnum.SEND_MESSAGE, {
      ...data,
      file: data?.file
        ? { name: data.file.name, type: data.file?.type ?? '', data: data.file }
        : undefined,
    });
  },
}));
