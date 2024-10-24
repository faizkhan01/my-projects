import {
  Avatar,
  Box,
  ButtonBase,
  Typography,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { ProfileData } from '@/types/user';
import { ChatMessage, MessageFile } from '@/types/chat';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ArrowsOutSimple, File } from '@phosphor-icons/react';
import { Attachment } from '@/types/attachment';
import { ConditionalWrapper } from '@/ui-kit/containers';
import Link from 'next/link';
import routes from '@/constants/routes';
import LightboxComponent from '@/ui-kit/LightBox';

interface Props {
  message: ChatMessage;
  profile: ProfileData;
}

const ImagePreview = ({ url }: { url: string }): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <ButtonBase
      onClick={() => setOpen(true)}
      sx={{
        position: 'relative',
      }}
    >
      <LightboxComponent
        open={open}
        slides={[
          {
            src: url,
          },
        ]}
        close={() => setOpen(false)}
        disablePlugins
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& > *': {
            opacity: '0',
          },
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.5)',

            '& > *': {
              opacity: '100%',
            },
          },
          transition: (theme) => theme.transitions.create(['background']),
          color: 'white',
        }}
      >
        <div className="transition-opacity">
          <ArrowsOutSimple size={24} />
        </div>
      </Box>
      <Image
        src={url}
        alt=""
        width={150}
        height={150}
        style={{ borderRadius: '2px', objectFit: 'cover' }}
      />
    </ButtonBase>
  );
};

const FilePreview = ({
  url,
  name,
  type,
}: {
  url: string;
  name: string;
  type: string;
}): JSX.Element => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[50],
        padding: 1,
        display: 'flex',
        gap: '4px',
        borderRadius: '4px',
        alignItems: 'center',
      }}
    >
      <IconButton color="inherit" onClick={() => window.open(url, '_blank')}>
        <File size={32} weight="fill" />
      </IconButton>
      <Typography sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box component="span">{name}</Box>
        {type && <Box component="span">Type: {type}</Box>}
      </Typography>
    </Box>
  );
};

export const MessageItem = ({ profile, message }: Props) => {
  const sender = message.sender?.id ?? message.senderId;
  const isOwn = sender === profile.id;

  let name = 'You';
  let avatar = profile?.avatar?.url ?? profile?.store?.logo?.url;
  let storeSlug: string | undefined;

  if (!isOwn) {
    if (message.sender?.store) {
      name = message.sender.store.name;
      avatar = message.sender.store.logo?.url;
      storeSlug = message.sender.store?.slug;
    } else {
      name = [message.sender?.firstName, message.sender?.lastName]
        .filter(Boolean)
        .join(' ');
      avatar = message.sender?.avatar?.url;
    }
  }

  const file = message?.files?.[0];

  const renderFile = useCallback(() => {
    if ((file as MessageFile)?.data instanceof ArrayBuffer) {
      const messageFile = file as MessageFile;
      const isImage = messageFile.type.startsWith('image');
      const blob = new Blob([messageFile.data], { type: messageFile.type });
      const url = URL.createObjectURL(blob);

      if (isImage) {
        return <ImagePreview url={url} />;
      } else {
        const otherFile = file as MessageFile;
        return (
          <FilePreview url={url} name={otherFile.name} type={otherFile.type} />
        );
      }
    } else if ((file as Attachment)?.url) {
      const attach = file as Attachment;
      const isImage = attach.mimeType.startsWith('image');

      if (isImage) {
        return <ImagePreview url={attach.url} />;
      } else {
        return (
          <FilePreview
            url={attach.url}
            name={attach.originalName ?? attach.fileName}
            type={attach.mimeType}
          />
        );
      }
    }

    return null;
  }, [file]);

  return (
    <div
      className={`flex ${
        isOwn ? 'flex-row-reverse self-end' : 'flex-row self-start'
      }`}
    >
      <div>
        <Avatar src={avatar ?? ''} sx={{ width: '32px', height: '32px' }} />
      </div>
      <div className="pl-2 pr-2">
        <div
          className={`flex w-full items-center gap-2 ${
            isOwn ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <ConditionalWrapper
            condition={!!storeSlug}
            wrapper={(children) => (
              <MuiLink
                component={Link}
                href={routes.STORES.INFO(storeSlug as string)}
                sx={{
                  color: 'inherit',
                }}
                underline="none"
              >
                {children}
              </MuiLink>
            )}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '18px',
              }}
            >
              {name}
            </Typography>
          </ConditionalWrapper>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: 'text.secondary',
            }}
          >
            {dayjs(message.createdAt).format('HH:mm')}
          </Typography>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {message.body && (
            <div className="bg-[#F6F9FF] p-4">
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '22.4px',
                }}
              >
                {message.body}
              </Typography>
            </div>
          )}

          {renderFile()}
        </div>
      </div>
    </div>
  );
};
