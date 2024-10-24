import { Socket } from 'socket.io-client';
import { ChatMessage, MessageFile } from './chat';
import { ChatEventEnum, SocketEventEnum } from './socketEvents.enum';

export interface WsResponse {
  status: boolean;
  message: string;
}

export interface ServerToClientEvents {
  [ChatEventEnum.SUBSCRIBE_TO_CHAT]: (data: WsResponse) => void;
  [ChatEventEnum.CREATE_CHAT]: (data: { chatId: number }) => void;
  [ChatEventEnum.SEND_MESSAGE]: (data: ChatMessage) => void;
  [ChatEventEnum.READ_MESSAGE]: (data: {
    messageIds: number[];
    chatId: number;
  }) => void;
  [ChatEventEnum.TYPING]: (data: {
    name: string;
    to: number;
    chatId: number;
  }) => void;

  [SocketEventEnum.EXCEPTION]: (error: WsResponse) => void;
}

export interface ClientToServerEvents {
  [ChatEventEnum.SUBSCRIBE_TO_CHAT]: () => void;
  [ChatEventEnum.READ_MESSAGE]: (data: {
    messageIds: number[];
    chatId: number;
  }) => void;
  [ChatEventEnum.SEND_MESSAGE]: (data: {
    chat: number;
    to: number;
    body: string;
    file?: MessageFile;
  }) => void;
  [ChatEventEnum.TYPING]: (data: {
    name: string;
    to: number;
    chatId: number;
  }) => void;
  [ChatEventEnum.CREATE_CHAT]: (data: {
    userId?: number;
    storeId?: number;
  }) => void;
}

export type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;
