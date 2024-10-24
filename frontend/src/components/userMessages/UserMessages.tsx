import {
  Box,
  Button,
  IconButton,
  Skeleton,
  CircularProgress,
  ButtonBase,
  Typography,
} from '@mui/material';
import { ChatList } from './ChatList';
import { ChatMessages } from './ChatMessages';
import { useEffect, useMemo, useState } from 'react';
import { ProfileData } from '@/types/user';
import { BackLinkButton } from '@/ui-kit/buttons';
import {
  ArrowLeft,
  CaretDown,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
// import { StructuredChat } from '@/types/chat';
import { useChats } from '@/hooks/queries/useChats';
import {
  ReadonlyURLSearchParams,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
// import Link from 'next/link';
// import { USER_ROLES } from '@/constants/auth';
import routes from '@/constants/routes';
import { GetChatsParams, GetChatsResponse } from '@/services/API/chat';
import { getNewSearchParams } from '@/utils/query';
import { SearchInput } from '@/ui-kit/inputs';
import { Menu, MenuItem } from '@/ui-kit/menu';
import useMenu from '@/hooks/useMenu';
import { usePaginationFilters } from '@/hooks/pagination/usePaginationFilters';
import { getPaginationCount } from '@/utils/pagination';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
// import { ConditionalWrapper } from '@/ui-kit/containers';
// import { TransitionProps } from '@mui/material/transitions';
// import { Loading } from '@/ui-kit/buttons/ContainedButton.stories';

interface UserMessagesProps {
  profile: ProfileData;
}

type FilterByTitle = 'Inbox' | 'Unread' | 'Sent';
type FilterByValue = GetChatsParams['filter_by'];
type Filters = GetChatsResponse['results']['filters'];
interface InboxFilterProps {
  inboxTitle: FilterByTitle;
  value: FilterByValue;
  numberOfMessages: number;
  unreadCount: number;
}

const AVAILABLE_FILTERS: {
  title: FilterByTitle;
  value: FilterByValue;
  getCount: (filters: Filters) => number;
}[] = [
  {
    title: 'Inbox',
    value: 'all',
    getCount: (filters: Filters) => filters.all,
  },
  {
    title: 'Unread',
    value: 'unread',
    getCount: (filters: Filters) => filters.unread,
  },
  {
    title: 'Sent',
    value: 'sent',
    getCount: (filters: Filters) => filters.sent,
  },
];

const getFilterFromParams = (params: ReadonlyURLSearchParams) => {
  return params.get('filter_by');
};

const NotificationNumber = ({ value }: { value: number }) => (
  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-error-main text-xs/[18px] text-white">
    {value}
  </span>
);

const ChatsPagination = (data: {
  page: number;
  perPage: number;
  total: number;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { offsetStart, offsetEnd } = getPaginationCount(data);

  return (
    <div className="flex flex-grow items-center justify-end gap-2">
      <IconButton
        disabled={offsetStart <= 1}
        component={Link}
        href={getNewSearchParams(
          searchParams,
          {
            page: data.page - 1,
          },
          pathname,
        )}
        scroll={false}
      >
        <CaretLeft size={16} weight="bold" />
      </IconButton>
      <Typography>
        {offsetStart} - {offsetEnd} of {data.total}
      </Typography>
      <IconButton
        disabled={offsetEnd >= data.total}
        component={Link}
        href={getNewSearchParams(
          searchParams,
          {
            page: data.page + 1,
          },
          pathname,
        )}
        scroll={false}
      >
        <CaretRight size={16} weight="bold" />
      </IconButton>
    </div>
  );
};

const InboxFilter = ({
  inboxTitle,
  numberOfMessages,
  value,
  unreadCount,
}: InboxFilterProps) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { push } = useRouter();
  const filter_by = getFilterFromParams(params);
  const selected = filter_by === value || (value === 'all' && !filter_by);

  return (
    <ButtonBase
      className={`flex h-[42px] w-[150px] items-center justify-between ${
        selected ? 'bg-[#F6F9FF]' : ''
      } p-3`}
      onClick={() => {
        push(
          getNewSearchParams(
            params,
            {
              filter_by: value,
            },
            pathname,
          ),
          {
            scroll: false,
          },
        );
      }}
    >
      <span className="text-base/[18px] font-medium text-[#333E5C]">
        {inboxTitle}
      </span>
      {!!unreadCount && value === 'all' && (
        <NotificationNumber value={unreadCount} />
      )}
      <span className="text-xs/[18px] font-medium text-[#96A2C1]">
        {numberOfMessages}
      </span>
    </ButtonBase>
  );
};

const MobileFilterSelector = ({
  filters,
  unreadCount,
}: {
  filters: Filters | null;
  unreadCount: number;
}) => {
  const { open, anchorEl, menuAria, buttonAria, handleClick, handleClose } =
    useMenu();
  const pathname = usePathname();
  const params = useSearchParams();
  const { push } = useRouter();

  const filter_by = getFilterFromParams(params);
  const selected = useMemo(
    () =>
      AVAILABLE_FILTERS.find((f) => f.value === filter_by) ??
      AVAILABLE_FILTERS[0],
    [filter_by],
  );

  return (
    <>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        {...menuAria}
        slotProps={{
          paper: {
            className: 'w-[150px]',
          },
        }}
      >
        {AVAILABLE_FILTERS.map((f) => (
          <MenuItem
            divider
            key={`${f.title}-menu`}
            className="flex justify-between"
            onClick={() => {
              push(
                getNewSearchParams(
                  params,
                  {
                    filter_by: f.value,
                  },
                  pathname,
                ),
                {
                  scroll: false,
                },
              );
              handleClose();
            }}
          >
            <span className="flex items-center gap-2">
              <Typography
                component="span"
                className="text-base/[18px] font-medium text-text-primary"
              >
                {f.title}
              </Typography>
              {!!unreadCount && f.value === 'all' && (
                <NotificationNumber value={unreadCount} />
              )}
            </span>
            <Typography
              className="text-xs/[18px] font-medium text-text-secondary"
              component="span"
            >
              {filters ? f.getCount(filters) : 0}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <Button
        className="flex items-center gap-2 text-text-primary"
        onClick={handleClick}
        {...buttonAria}
      >
        <Typography component="span" className="font-semibold">
          {selected?.title}
        </Typography>
        {!!unreadCount && selected.value === 'all' && (
          <NotificationNumber value={unreadCount} />
        )}
        <Typography component="span" className="text-text-secondary">
          {filters ? selected?.getCount(filters) : 0}
        </Typography>
        <CaretDown size={12} weight="bold" />
      </Button>
    </>
  );
};

export const UserMessages = ({ profile }: UserMessagesProps) => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const qSearch = searchParams.get('q');
  const [search, setSearch] = useState<string>(qSearch ? qSearch : '');
  const debouncedSearch = useDebounce(search, 500);
  const { limit, offset, page, perPage } = usePaginationFilters({
    defaultPerPage: 10,
  });

  const chatId = Number(params.id);
  const [selectedChatId, setSelectedChatId] = useState<number>(
    isNaN(chatId) ? -1 : chatId,
  );
  const { data, isLoading } = useChats({
    q: debouncedSearch ? debouncedSearch : undefined,
    filter_by:
      (searchParams.get('filter_by') as GetChatsParams['filter_by']) ??
      undefined,
    limit,
    offset,
  });

  const chats = useMemo(() => data?.chats ?? [], [data?.chats]);
  const filters = data?.filters;

  const handleChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const selectedChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId);
  }, [chats, selectedChatId]);

  useEffect(() => {
    if (selectedChatId !== -1 && chatId !== selectedChatId) {
      const newPath = getNewSearchParams(
        searchParams,
        {},
        routes.DASHBOARD.MESSAGES.ONE(selectedChatId),
      );
      push(
        newPath,

        {
          scroll: false,
        },
      );
    }
  }, [selectedChatId, push, chatId, searchParams]);

  useEffect(() => {
    // This is to update the url when the debounced search changes
    // ERROR: This makes impossible to go back to previous page (due to the push)
    if (offset === 0) {
      push(
        getNewSearchParams(
          searchParams,
          {
            q: debouncedSearch,
            page: 1,
          },
          pathname,
        ),
        {
          scroll: false,
        },
      );
    }
  }, [debouncedSearch, offset, pathname, push, searchParams]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: {
          xs: 'none',
          md: '0px 0.5008620619773865px 6.636422634124756px 0px #00000005, 0px 4px 53px 0px #0000000A',
        },
      }}
    >
      {!selectedChat && (
        <div className="flex items-center justify-between md:hidden">
          <div className="flex w-full items-center">
            <BackLinkButton
              text=""
              sx={{
                minWidth: 'auto',
                paddingRight: 0,
              }}
            />
            <div className="flex flex-1 justify-between">
              <MobileFilterSelector
                filters={filters ?? null}
                unreadCount={data?.unreadCount ?? 0}
              />
              <ChatsPagination
                page={page}
                perPage={perPage}
                total={data?.pagination.total ?? 0}
              />
            </div>
          </div>
        </div>
      )}
      <div className="mb-1 mt-4 flex w-full px-0 md:mb-0 md:mt-0 md:flex md:px-4 md:py-[15px]">
        <SearchInput
          placeholder="Search Messages"
          value={search}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          label="Search Messages"
          hideSearchButton
        />
      </div>
      <div className="flex h-auto md:h-[600px] md:max-h-none md:border md:border-solid md:border-[#EAECF4]">
        <div className="hidden flex-row border-r border-solid border-[#EAECF4] md:flex">
          <div className="w-[182px] flex-col gap-1 px-4 pb-8 pl-4 md:pt-4">
            {AVAILABLE_FILTERS.map((f) => (
              <InboxFilter
                key={f.title}
                inboxTitle={f.title}
                numberOfMessages={filters ? f.getCount(filters) : 0}
                value={f.value}
                unreadCount={data?.unreadCount ?? 0}
              />
            ))}
          </div>
        </div>
        <div
          className={
            'w-full md:w-auto md:border-r md:border-solid md:border-[#EAECF4]'
          }
        >
          <div className="hidden flex-col gap-3 border-b border-solid border-[#EAECF4] px-4 pb-3 pt-4 md:flex md:w-[200px] lg:w-[270px]">
            <Typography className="text-base/[18px] font-semibold">
              Inbox
            </Typography>
            <div className="flex h-5 items-center">
              <ChatsPagination
                page={page}
                perPage={perPage}
                total={data?.pagination.total ?? 0}
              />
            </div>
          </div>
          <ChatList
            chats={chats}
            selected={selectedChatId}
            handleChat={handleChat}
            profile={profile}
            loading={isLoading}
          />
        </div>
        {selectedChat && (
          <>
            <div className="fixed left-0 top-0 z-[5000] h-full w-screen bg-white md:static">
              <div className="fixed left-0 right-0 top-0 z-10 flex h-[50px] items-center border-b-[0.4px] border-solid border-[#CCC] bg-white p-4 md:hidden">
                <IconButton
                  className="z-20 p-0"
                  onClick={() => {
                    setSelectedChatId(-1);
                    push(routes.DASHBOARD.MESSAGES.LIST);
                  }}
                >
                  <ArrowLeft size={14} weight="bold" />
                </IconButton>
                <div className="absolute left-0 flex w-full items-center justify-center">
                  <Typography className="text-[14px]/[18px] font-semibold">
                    {!isLoading && selectedChat ? (
                      selectedChat.user.name
                    ) : (
                      <Skeleton variant="rectangular" width={150} />
                    )}
                  </Typography>
                </div>
              </div>
              <div className="h-full pt-[50px] md:pt-0">
                {!isLoading && selectedChat ? (
                  <ChatMessages chat={selectedChat} profile={profile} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <CircularProgress className="text-indigo-500" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Box>
  );
};
