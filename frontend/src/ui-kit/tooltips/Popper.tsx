import { FC, ReactNode } from 'react';
import PopperMUI, {
  type PopperProps as MuiPopperProps,
} from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import ClickAwayListener, {
  ClickAwayListenerProps,
} from '@mui/material/ClickAwayListener';
import { Grow, Paper, PaperProps } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  borderRadius: '20px',
  position: 'relative',
  boxShadow:
    '0px 43px 203px rgba(0, 0, 0, 0.05), 0px 12.9632px 61.1986px rgba(0, 0, 0, 0.0325794), 0px 5.38427px 25.4188px rgba(0, 0, 0, 0.025), 0px 1.94738px 9.19346px rgba(0, 0, 0, 0.0174206)',
}));

export interface PopperProps extends MuiPopperProps {
  children: ReactNode;
  onClickAway: ClickAwayListenerProps['onClickAway'];
  slotProps?: MuiPopperProps['slotProps'] & {
    paper?: PaperProps | ((props: PaperProps) => PaperProps);
  };
}

export const Popper: FC<PopperProps> = ({
  children,
  slotProps,
  onClickAway,
  ...rest
}) => (
  <PopperMUI
    transition
    slotProps={{
      root: slotProps?.root,
    }}
    {...rest}
  >
    {({ TransitionProps }) => (
      <ClickAwayListener onClickAway={onClickAway}>
        <Grow {...TransitionProps}>
          <StyledPaper {...slotProps?.paper}>{children}</StyledPaper>
        </Grow>
      </ClickAwayListener>
    )}
  </PopperMUI>
);
