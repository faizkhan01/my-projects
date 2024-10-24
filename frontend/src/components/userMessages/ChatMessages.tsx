import { styled } from '@mui/material/styles';
import {
  Badge,
  IconButton,
  InputAdornment,
  InputBase,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  File,
  FileImage,
  FileText,
  PaperPlaneRight,
  Paperclip,
  XCircle,
} from '@phosphor-icons/react';
import { MessagesList } from './MessagesList';
import { ProfileData } from '@/types/user';
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChatMessageStatusEnum, StructuredChat } from '@/types/chat';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
// import { useDropzone } from 'react-dropzone';
import { groupBy } from 'lodash';
import dayjs from 'dayjs';
import { useChatMessages } from '@/hooks/queries/useChatMessages';
import { shallow } from 'zustand/shallow';
import { produce } from 'immer';
import { useDropzone } from 'react-dropzone';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const ChatInput = styled(InputBase)(({ theme }) => ({
  border: 'none',
  padding: '16px 16px',
  backgroundColor: theme.palette.grey[50],
  color: theme.palette.text.primary,
  width: '100%',
  height: '40px',

  '& .MuiInputBase-input': {
    padding: '0',
  },

  '&::placeholder': {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '18px',
    color: theme.palette.text.primary,
  },

  [theme.breakpoints.down('md')]: {
    paddingLeft: '16px',
  },
}));

interface ChatMessagesProps {
  chat: StructuredChat;
  profile: ProfileData;
}

const defaultData: { message: string; file: File | null } = {
  message: '',
  file: null,
};

const MessageSender = ({
  chatId,
  receiver,
  sender,
}: {
  chatId: number;
  receiver: StructuredChat['user'];
  sender: ProfileData;
}) => {
  const [form, setForm] = useState({
    [chatId]: defaultData,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (accepted: File[]) => {
    setForm(
      produce((draft) => {
        draft[chatId].file = accepted[0];
      }),
    );
  };

  const { sendMessage, sendTyping, typing, clearTyping } = useSocketStore(
    (state) => ({
      sendMessage: state.sendMessage,
      sendTyping: state.sendTyping,
      typing: state.typing,
      clearTyping: state.clearTyping,
    }),
    shallow,
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const renderFileIcon = (type: File['type'], size: 'small' | 'normal') => {
    const iconSize = size === 'normal' ? 24 : 16;
    const iconWeight = 'fill';
    const firstPart = type.split('/')[0];
    switch (firstPart) {
      case 'image':
        return <FileImage size={iconSize} weight={iconWeight} />;
      case 'text':
        return <FileText size={iconSize} weight={iconWeight} />;
      default:
        return <File size={24} weight={iconWeight} />;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { message, file } = form[chatId];

    if (!message && !file) {
      return;
    }

    sendMessage({
      chat: chatId,
      to: receiver.id,
      body: message.trim(),
      file: file ?? undefined,
    });
    setForm(
      produce((draft) => {
        delete draft[chatId];
      }),
    );
  };

  const handleTyping = () => {
    const name = sender?.store
      ? sender.store.name
      : `${sender.firstName} ${sender.lastName}`;

    sendTyping({ name, chatId, to: receiver.id });
  };

  const removeFile = () => {
    setForm(
      produce((draft) => {
        draft[chatId].file = null;
      }),
    );
  };

  useEffect(() => {
    if (!form[chatId]) {
      setForm(
        produce((draft) => {
          draft[chatId] = defaultData;
        }),
      );
    }
  }, [chatId, form]);

  useEffect(() => {
    if (typing?.[chatId]) {
      const timeout = setTimeout(() => {
        clearTyping({ chatId });
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [chatId, typing, clearTyping]);

  const file = form[chatId]?.file;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col p-4 md:p-6">
        <div className="relative flex w-full">
          <ChatInput
            placeholder="Write a message"
            inputProps={{
              'aria-label': 'write a message',
            }}
            startAdornment={
              <InputAdornment position="start">
                <Badge
                  badgeContent={
                    file && (
                      <IconButton color="error" onClick={removeFile}>
                        <XCircle size={14} weight="fill" />
                      </IconButton>
                    )
                  }
                >
                  <Tooltip title={file?.name ?? 'Upload a file'}>
                    <IconButton
                      size="small"
                      {...getRootProps()}
                      type="button"
                      sx={{
                        // display: {
                        //   xs: 'flex',
                        //   md: 'none',
                        // },
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <input {...getInputProps()} />
                      {file && renderFileIcon(file.type, 'small')}
                      {!file && <Paperclip size={16} weight="light" />}
                    </IconButton>
                  </Tooltip>
                </Badge>
              </InputAdornment>
            }
            value={form[chatId]?.message ?? ''}
            onChange={(e) => {
              const { value } = e.target;

              handleTyping();
              setForm((prev) => ({
                ...prev,
                [chatId]: { ...prev[chatId], message: value },
              }));
            }}
            inputRef={inputRef}
          />
          <IconButton
            className="m-0 ml-[12px] h-[40px] w-[40px] rounded-[4px] bg-indigo-500 p-[8px] text-white "
            type="submit"
          >
            <PaperPlaneRight size={24} />
          </IconButton>

          {typing?.[chatId] && (
            <Typography
              fontSize="12px"
              color="text.secondary"
              sx={{
                position: 'absolute',
                top: '100%',
                mt: '4px',
              }}
            >
              {typing[chatId].name} is typing...
            </Typography>
          )}
        </div>
      </div>
    </form>
  );
};

export const ChatMessages = ({ chat, profile }: ChatMessagesProps) => {
  const [initialScroll, setInitialScroll] = useState(false);
  const { data, setSize, size, isLoading } = useChatMessages(chat.id);

  const readMessages = useSocketStore((state) => state.readMessages);
  const messages = useMemo(
    () => [...(data ?? [])]?.reverse().flatMap((d) => d.results.results),
    [data],
  );
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEnd =
    (data?.[0]?.total ?? Number.POSITIVE_INFINITY) <= messages.length;

  const haveMessages = Boolean(messages?.length);
  const unreadMessages = useMemo(
    () =>
      messages.filter((m) => {
        const senderId = m?.senderId ?? m.sender?.id;

        return (
          m.status !== ChatMessageStatusEnum.READ && senderId !== profile.id
        );
      }),
    [messages, profile.id],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [topListRef, entry] = useIntersectionObserver();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
    });
  };

  const markAsRead = useCallback(() => {
    if (!unreadMessages.length) return;

    readMessages({
      messageIds: unreadMessages.map((m) => m.id),
      chatId: chat.id,
    });
  }, [chat.id, readMessages, unreadMessages]);

  useEffect(() => {
    // Scroll to bottom if it receives a message and the scroll is at the bottom
    const scrollHeight = messagesEndRef.current?.scrollHeight ?? 0;
    const scrollTop = messagesEndRef.current?.scrollTop ?? 0;

    if (scrollHeight - scrollTop < 1000) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
    markAsRead();
  }, [chat.id, markAsRead]);

  useEffect(() => {
    const isVisible = entry?.isIntersecting;

    if (isLoadingMore) {
      messagesEndRef.current?.scrollTo({
        top: messagesEndRef.current.scrollTop,
      });
    }

    if (isVisible && !isLoadingMore && !isEnd) {
      setSize(size + 1);
    }
  }, [entry?.isIntersecting, setSize, size, isLoadingMore, isEnd]);

  useEffect(() => {
    // Scroll to bottom after loading the messages and only once
    if (haveMessages || !initialScroll) {
      setInitialScroll(true);
      scrollToBottom();
    }
  }, [haveMessages, initialScroll]);

  const groupedMessages = useMemo(
    () =>
      groupBy(messages, (message) => {
        const date = new Date(message.createdAt);
        const isToday = dayjs().isSame(date, 'day');
        return isToday ? 'Today' : dayjs(date).format('MMMM D, YYYY');
      }),
    [messages],
  );

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden ${
        haveMessages ? 'items-end' : 'items-center'
      }`}
    >
      {haveMessages ? (
        <div
          className="flex h-full w-full overflow-y-auto"
          ref={messagesEndRef}
        >
          <MessagesList
            topRef={topListRef}
            messages={groupedMessages}
            profile={profile}
            loadingMore={isLoadingMore && !isEnd}
          />
        </div>
      ) : (
        <Typography
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 400,
            fontSize: '32px',
            lineHeight: '40px',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          You have no messages
        </Typography>
      )}

      <div className="w-full bg-white">
        <MessageSender chatId={chat.id} receiver={chat.user} sender={profile} />
      </div>
    </div>
  );
};
