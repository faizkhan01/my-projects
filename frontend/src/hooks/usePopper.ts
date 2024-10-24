import { useState } from 'react';

const usePopper = (id?: string) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickAway = () => setOpen(false);

  const canBeOpen = open && Boolean(anchorEl);
  const resulTid = canBeOpen && id ? id : undefined;

  return {
    open: canBeOpen,
    id: resulTid,
    handleClick,
    handleClickAway,
    anchorEl,
    handleClose,
  };
};

export default usePopper;
