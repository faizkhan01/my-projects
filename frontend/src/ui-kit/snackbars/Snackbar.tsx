import { useCallback } from 'react';
import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar, {
  SnackbarProps as MuiSnackbarProps,
} from '@mui/material/Snackbar';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { X } from '@phosphor-icons/react';

const StyledSnackbar = styled(MuiSnackbar)(() => ({
  borderRadius: '2px 2px 0px 0px',
}));

interface AlertProps extends BoxProps {
  severity?: 'warning' | 'success' | 'error' | 'info';
}

const Alert = styled(Box)<AlertProps>(({ theme, severity = 'success' }) => ({
  backgroundColor: theme.palette[severity].main,
  color: theme.palette[severity].contrastText,
  padding: '8px 16px',
  fontSize: '16px',
  width: '100%',
}));

const AlertContent = styled(Box)({
  display: 'flex',
  gap: '24px',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AlertText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  margin: '4px 0',
});

const AlertTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: '600',
});

const SlideUp = (props: SlideProps) => <Slide {...props} direction="up" />;

export interface SnackbarProps extends MuiSnackbarProps {
  severity?: AlertProps['severity'];
}

export const Snackbar = ({
  message,
  severity = 'success',
  onClose,
  ...props
}: SnackbarProps) => {
  const renderTitle = useCallback(() => {
    switch (severity) {
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
    }
  }, [severity]);

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      TransitionComponent={SlideUp}
      onClose={onClose}
      sx={{
        bottom: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
        right: {
          sx: '16px',
          sm: '134px',
        },
      }}
      {...props}
    >
      <Alert role="alert" severity={severity}>
        <AlertContent>
          <AlertText>
            <AlertTitle>{renderTitle()}</AlertTitle>
            {message}
          </AlertText>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: 'common.white',
              borderColor: 'transparent',
              opacity: '0.4',
              display: { xs: 'none', sm: 'flex' },
            }}
          />
          <IconButton
            onClick={(e) => onClose && onClose(e, 'timeout')}
            aria-label="Close"
            size="small"
            sx={{
              color: 'common.white',
              padding: '0',
            }}
          >
            <X size={24} />
          </IconButton>
        </AlertContent>
      </Alert>
    </StyledSnackbar>
  );
};
