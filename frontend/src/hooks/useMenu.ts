import { ButtonProps, MenuProps } from '@mui/material';
import { useCallback, useId, useState } from 'react';

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const id = useId();
  const menuId = id;
  const buttonId = `${id}-button`;

  return {
    open,
    handleClick,
    handleClose,
    anchorEl,
    menuId,
    buttonId,
    buttonAria: {
      id: buttonId,
      'aria-controls': open ? menuId : undefined,
      'aria-haspopup': 'true',
      'aria-expanded': open ? 'true' : undefined,
    } satisfies ButtonProps,
    menuAria: {
      id: menuId,
      'aria-labelledby': buttonId,
    } satisfies Omit<MenuProps, 'open'>,
  };
};

export default useMenu;
