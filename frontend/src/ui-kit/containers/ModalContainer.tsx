import { styled, Theme } from '@mui/material/styles';
import {
  Dialog,
  Box,
  DialogProps,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { ArrowLeft, X } from '@phosphor-icons/react';
import { ButtonWithIcon } from '../buttons/ButtonWithIcon';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
    },
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(51,62,92,0.7)',
  },
}));

interface ModalContainerProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  isCloseButton?: boolean;
  mobileFullScreen?: boolean;
}

export const ModalContainer = ({
  open,
  onClose,
  isCloseButton = true,
  children,
  scroll = 'body',
  mobileFullScreen = true,
  ...props
}: ModalContainerProps): JSX.Element => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      {...props}
      fullScreen={isMobile && mobileFullScreen}
    >
      {isCloseButton &&
        (isMobile && mobileFullScreen ? (
          <Box sx={{ position: 'absolute', top: '27px', left: '16px' }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={onClose}
            >
              <ArrowLeft size={14} weight="light" />
              <Typography
                sx={{
                  ml: '6px',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '18px',
                }}
              >
                Back
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: isMobile ? '0' : '20px',
              right: isMobile ? '0' : '20px',
            }}
          >
            <ButtonWithIcon
              icon={
                <X width={isMobile ? 18 : 24} height={isMobile ? 18 : 24} />
              }
              onClick={onClose}
              sx={isMobile ? { padding: '12px', zIndex: 1 } : {}}
              iconColor="text.secondary"
              iconHoverColor="text.primary"
            />
          </Box>
        ))}
      {children}
    </StyledDialog>
  );
};
