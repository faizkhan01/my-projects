import { StructuredChat } from '@/types/chat';
import { ProfileData } from '@/types/user';
import { Divider, Skeleton, Typography, Box } from '@mui/material';
import { ChatItem } from './ChatItem';
import { useEffect, useRef } from 'react';

interface ChatListProps {
  chats: StructuredChat[];
  selected: number | null;
  handleChat: (chatId: number) => void;
  profile: ProfileData;
  loading?: boolean;
}

export const ChatList = ({
  chats,
  selected,
  handleChat,
  profile,
  loading = false,
}: ChatListProps) => {
  const refs = useRef<Record<number, HTMLDivElement>>({});
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected === -1 || !chats.length) return;

    const ref = refs.current?.[selected ?? -1];

    if (!ref) return;
    if (!refContainer.current) return;

    // This is to avoid the scroll to be at the top when changing between chats
    // This is caused because of changes in URL
    refContainer.current.scrollTo({
      top: ref.offsetTop - 200,
    });
  }, [chats, selected]);

  return (
    <Box
      ref={refContainer}
      sx={{
        display: {
          xs: selected === -1 || !chats.length ? 'flex' : 'none',
          md: 'flex',
        },
        position: 'relative',
        flexDirection: 'column',
        height: { xs: 'auto', md: '500px' },
        width: { xs: '100%', md: '200px', lg: '270px' },
        overflowY: {
          md: 'auto',
        },
      }}
    >
      {loading &&
        new Array(3)
          .fill(undefined)
          .map((_, i) => (
            <Skeleton
              variant="rounded"
              key={`${i}-ChatItem`}
              height={70}
              sx={{ mb: '2px' }}
            />
          ))}
      {chats.map((chat, i) => (
        <div
          onClick={() => handleChat(chat.id)}
          key={chat.id}
          ref={(el) => {
            if (!chat.id || !el) return;
            refs.current[chat.id] = el;
          }}
        >
          <ChatItem
            chat={chat}
            selected={selected === chat.id}
            profile={profile}
          />
          {chats[i + 1] !== undefined && (
            <Divider
              sx={{
                display: {
                  xs: 'block',
                  md: 'none',
                },
              }}
            />
          )}
        </div>
      ))}
      {!loading && !chats.length && (
        <div className="flex h-full items-center justify-center text-text-secondary">
          <Typography fontSize="24px" textAlign="center">
            There are no chats yet
          </Typography>
        </div>
      )}
    </Box>
  );
};
