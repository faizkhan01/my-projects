import { styled } from '@mui/system';
import { BackLinkButton, ToggleButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import React, { useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Tab,
  Typography,
  Divider,
  Button,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import { Notification } from '@/types/notifications';
import { markReadNotification } from '@/services/API/notifications';
import { mutate } from 'swr';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: '600',
  fontSize: '24px',
  padding: '8px 0px 8px 0px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontWeight: '600',
    padding: '6px 20px 6px 20px',
    fontSize: '14px',
    flex: 1,
  },
}));

const StyledTabList = styled(TabList)(({ theme }) => ({
  width: '100%',
  '& .MuiTabs-flexContainer': {
    gap: '48px',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTabs-flexContainer': {
      gap: '0',
    },
  },
}));

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: '0px',
}));

const StyledDot = styled(Box)(({ theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,

  [theme.breakpoints.down('sm')]: {
    margin: '21px 8px 0px 0px',
    width: '8px',
    height: '8px',
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  margin: '24px 0px 8px 0px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    margin: '16px 0px 8px 0px',
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '8px',
  },
}));

const PrimaryText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  marginBottom: '8px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    marginBottom: '8px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  marginTop: '24px',
  color: theme.palette.primary.main,
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    marginTop: '16px',
  },
}));

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '96px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '55px',
  },
}));

interface NotificationsProps {
  allNotifications?: Notification[];
  loadMore: () => void;
  isEnd: boolean;
}

const NotificationCenter = ({
  allNotifications,
  loadMore,
  isEnd,
}: NotificationsProps) => {
  const [value, setValue] = useState('1');
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const timeout = useRef<ReturnType<typeof setInterval> | null>(null);

  return (
    <Box>
      <BackLinkButton />
      <MobileHeading title="Notifications Center" />
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            width: {
              xs: '100%',
              sm: 'fit-content',
            },
          }}
        >
          <StyledTabList
            aria-label="Notifications Tabs"
            onChange={handleChange}
            indicatorColor="primary"
          >
            <StyledTab label="Latest Notifications" value="1" />
            {/* <StyledTab label="Configure Notifications" value="2" /> */}
          </StyledTabList>
        </Box>
        <StyledTabPanel value="1">
          {allNotifications?.map((notification, i) => {
            const isToday = dayjs(notification.createdAt).isSame(
              dayjs(),
              'day',
            );
            return (
              <Stack
                key={notification.id}
                sx={{
                  pt:
                    i === 0
                      ? {
                          xs: '22px',
                          sm: '24px',
                        }
                      : { xs: '16px', sm: '24px' },
                }}
                spacing={1}
                {...(notification.url
                  ? {
                      onClick: () => {
                        markReadNotification(notification.id);
                      },
                    }
                  : {
                      onMouseLeave: () =>
                        timeout.current && clearTimeout(timeout.current),
                      onMouseOver: () =>
                        (timeout.current = setTimeout(
                          () =>
                            mutate(
                              '/notifications',
                              markReadNotification(notification.id),
                            ),
                          2000,
                        )),
                    })}
              >
                <MuiLink
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                  }}
                  underline={notification.url ? 'hover' : 'none'}
                  component={notification.url ? Link : 'div'}
                  href={notification.url}
                >
                  {notification.read ? null : <StyledDot />}
                  <Typography
                    sx={{ margin: 0 }}
                    fontWeight={600}
                    component="span"
                  >
                    {notification.title}
                  </Typography>
                </MuiLink>
                <PrimaryText sx={{ margin: 0 }}>
                  {notification.message}
                </PrimaryText>
                <Typography
                  fontSize="12px"
                  lineHeight="18px"
                  color="text.secondary"
                >
                  {isToday
                    ? dayjs(notification.createdAt).fromNow()
                    : dayjs(notification.createdAt).format('DD MMMM')}
                </Typography>
                <Divider
                  sx={{
                    pb: {
                      xs: '16px',
                      sm: '24px',
                    },
                    margin: '0 !important',
                  }}
                />
              </Stack>
            );
          })}
          <FlexBox>
            {!isEnd && (
              <StyledButton onClick={() => loadMore()}>Show more</StyledButton>
            )}
          </FlexBox>
        </StyledTabPanel>
        <StyledTabPanel value="2">
          <Box>
            <TitleText>Wish List</TitleText>
            <PrimaryText>
              Find out about price drops and the availability of your favorite
              products
            </PrimaryText>
            <ToggleButton label="Push Notification" />
            <ToggleButton label="Email" />
          </Box>
          <Box>
            <TitleText>Discounts and promotions</TitleText>
            <PrimaryText>Save on promotions and sales</PrimaryText>
            <ToggleButton label="Push Notification" />
            <ToggleButton label="Email" />
            <ToggleButton label="SMS" />
          </Box>
          <Box>
            <TitleText>Comments</TitleText>
            <PrimaryText>
              These are notification for comments on your post and replies to
              your comments
            </PrimaryText>
            <ToggleButton label="Push Notification" />
            <ToggleButton label="Email" />
          </Box>
          <Box>
            <TitleText>Reminders</TitleText>
            <PrimaryText>
              These are notification to remind you of updates you might have
              missed
            </PrimaryText>
            <ToggleButton label="Push Notification" />
            <ToggleButton
              sx={{
                marginBottom: {
                  xs: '55px',
                },
              }}
              label="Email"
            />
          </Box>
        </StyledTabPanel>
      </TabContext>
    </Box>
  );
};

export default NotificationCenter;
