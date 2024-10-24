import { Attachment } from './attachment';
import { ProfileData } from './user';

export type ChatUser = Pick<
  ProfileData,
  'id' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'store'
>;

export interface Chat {
  id: number;
  creator: ChatUser;
  receiver: ChatUser;
  lastMessageAt?: Date | null;
  lastMessageText?: string | null;
}

export interface StructuredChat {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
    role: ChatUser['role'];
    storeSlug?: string;
  };
  lastMessageAt?: Date | null;
  lastMessageText?: string | null;
}

export interface MessageFile {
  data: ArrayBuffer | File;
  name: string;
  type: string;
}

export interface ChatMessage {
  id: number;
  senderId?: number;
  sender?: ChatUser;
  body: string;
  status?: ChatMessageStatusEnum;
  createdAt: Date;
  files?: Attachment[] | MessageFile[];
  chat_id: number;
}

export enum ChatMessageStatusEnum {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  READ = 'READ',
}
