import { useChatMessages } from '@/hooks/queries/useChatMessages';
import { ChatMessageStatusEnum, StructuredChat } from '@/types/chat';
import { ProfileData } from '@/types/user';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';
dayjs.extend(relativeTime);

interface ChatItemProps {
  chat: StructuredChat;
  selected?: boolean;
  profile: ProfileData;
}

const GrowBar = ({ grow }: { grow: boolean }) => (
  <span
    className={`absolute left-0 top-0 hidden w-1 transition-[height] duration-200 ease-in-out md:block md:bg-primary-main ${
      grow ? 'h-full' : 'h-0'
    }`}
  />
);

export const ChatItem = ({ chat, selected, profile }: ChatItemProps) => {
  const name = chat?.user?.name;
  const { data, isLoading } = useChatMessages(chat?.id);
  const messages = data?.[0].results.results;
  const unreadMessages = useMemo(
    () =>
      messages
        ? messages.filter((m) => {
            const senderId = m.senderId ?? m.sender?.id;
            return (
              senderId !== profile.id && m.status !== ChatMessageStatusEnum.READ
            );
          }).length
        : 0,
    [messages, profile.id],
  );

  const fromNow = chat.lastMessageAt
    ? dayjs(chat?.lastMessageAt).fromNow()
    : null;

  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'flex',
        position: 'relative',
        alignItems: 'start',
        width: '100%',
        marginY: {
          xs: '16px',
          md: 0,
        },
        paddingY: {
          md: '16px',
        },
        paddingRight: '0px',
        paddingLeft: '0px',
        borderBottom: {
          md: '1px solid #EAECF4',
        },
        background: selected
          ? 'linear-gradient(90deg, #DEDDFF 0%, rgba(222, 221, 255, 0.2) 100%)'
          : 'none',
      }}
    >
      <GrowBar grow={!!selected} />
      <div className="flex w-full gap-2 px-0 md:block md:px-[16px]">
        <div className="flew-grow flex w-full flex-col">
          <div className="flex flex-grow items-center justify-between gap-2">
            <Typography
              pb="4px"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: '18px',
              }}
            >
              {name}
            </Typography>
            <Typography
              pb="4px"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '12px', md: '12px' },
                lineHeight: '18px',
                color: 'GrayText',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              {fromNow}
            </Typography>
          </div>
          <Typography
            pb="4px"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '12px', md: '12px' },
              lineHeight: '19.2px',
            }}
          >
            {chat.lastMessageText}
          </Typography>
          <Typography
            pb="4px"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '12px', md: '12px' },
              lineHeight: '18px',
              color: 'GrayText',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {fromNow}
          </Typography>

          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: 'text.secondary',
            }}
          >
            {!!unreadMessages && `${unreadMessages} unread messages`}
            {!messages?.length && !isLoading && 'No messages yet'}
          </Typography>
        </div>
      </div>
    </Box>
  );
};
