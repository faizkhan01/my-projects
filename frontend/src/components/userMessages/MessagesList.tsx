import { ChatMessage } from '@/types/chat';
import { ProfileData } from '@/types/user';
import { CircularProgress, Typography } from '@mui/material';
import type { Dictionary } from 'lodash';
import { RefObject } from 'react';
import { MessageItem } from './MessageItem';

interface MessagesListProps {
  messages: Dictionary<ChatMessage[]>;
  profile: ProfileData;
  loadingMore?: boolean;
  topRef: RefObject<HTMLDivElement>;
}

export const MessagesList = ({
  profile,
  messages,
  loadingMore = false,
  topRef,
}: MessagesListProps) => {
  return (
    <div className="w-full px-4 pb-4 md:px-6 md:pb-6">
      {loadingMore && (
        <div className="flex justify-center">
          <CircularProgress size={30} />
        </div>
      )}
      {Object.entries(messages).map(([date, messages], i) => {
        return (
          <div
            className="mt-6 flex w-full flex-col gap-6 overflow-y-auto"
            key={date}
          >
            <Typography
              sx={{ textAlign: 'center' }}
              color="text.secondary"
              ref={i === 0 ? topRef : undefined}
            >
              {date}
            </Typography>
            {messages.map((m) => (
              <MessageItem key={m.id} message={m} profile={profile} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
