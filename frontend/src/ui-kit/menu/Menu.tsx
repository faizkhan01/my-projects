import { styled } from '@mui/material/styles';
import {
  Menu as MuiMenu,
  MenuProps as MuiMenuProps,
  MenuList as MuiMenuList,
} from '@mui/material';
import { Popper, PopperProps } from '../tooltips';

export type MenuProps =
  | ({
      usePopper?: true;
    } & Omit<MuiMenuProps, 'transformOrigin' | 'anchorOrigin'> &
      Pick<PopperProps, 'placement'>)
  | ({
      usePopper?: false;
    } & MuiMenuProps);

const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: 20,
    width: '290px',
    padding: '0px',
    boxShadow:
      '0px 43px 203px rgba(0, 0, 0, 0.05), 0px 12.9632px 61.1986px rgba(0, 0, 0, 0.0325794), 0px 5.38427px 25.4188px rgba(0, 0, 0, 0.025), 0px 1.94738px 9.19346px rgba(0, 0, 0, 0.0174206)',
  },
  '& .MuiList-root': {
    padding: '0px',
  },
}));

const StyledMenuList = styled(MuiMenuList)(() => ({
  padding: '0px',
}));

const MenuWithPopper = ({
  open,
  onClose,
  MenuListProps,
  slotProps,
  ...props
}: MenuProps) => {
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      onClose?.(event, 'backdropClick');
    } else if (event.key === 'Escape') {
      onClose?.(event, 'escapeKeyDown');
    }
  }

  return (
    <Popper
      open={open}
      onClickAway={(e) => onClose?.(e, 'backdropClick')}
      slotProps={{
        paper: {
          className: 'p-0',
          ...slotProps?.paper,
        },
        ...slotProps,
      }}
      {...props}
    >
      <StyledMenuList
        autoFocusItem={open}
        onKeyDown={handleListKeyDown}
        {...MenuListProps}
      >
        {props.children}
      </StyledMenuList>
    </Popper>
  );
};

export const Menu = ({ usePopper, ...props }: MenuProps) => {
  if (!usePopper) return <StyledMenu {...props} />;

  return <MenuWithPopper {...props} />;
};
