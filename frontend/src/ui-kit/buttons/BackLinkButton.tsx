'use client';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface BackLinkButtonProps {
  text?: string;
  backUrl?: string;
  mode?: 'history' | 'before-last';
  sx?: SxProps<Theme>;
}

const BUTTON_STYLED = {
  margin: '0',
  color: 'text.secondary',
  display: { xs: 'inline-flex', md: 'none' },
  pl: 0,
  /* ml: '1rem', */
  justifyContent: 'flex-start',
};

const BUTTON_SPAN = {
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '18px',
  fontStyle: 'normal',
  paddingLeft: '8px',
  color: 'text.primary',
};

export const BackLinkButton = ({
  text = 'Back',
  backUrl,
  mode = 'before-last',
  sx,
}: BackLinkButtonProps) => {
  const pathname = usePathname();
  const { back } = useRouter();
  const url = backUrl || pathname.slice(0, pathname.lastIndexOf('/')) + '/';

  return (
    <Button
      sx={{
        ...BUTTON_STYLED,
        ...sx,
      }}
      component={mode === 'history' ? 'button' : Link}
      href={mode === 'history' ? undefined : url}
      onClick={mode === 'history' ? () => back() : undefined}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        component="span"
      >
        <ArrowLeft size={18} />
        <Typography sx={BUTTON_SPAN} component="span">
          {text}
        </Typography>
      </Box>
    </Button>
  );
};
