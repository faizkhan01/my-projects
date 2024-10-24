import { useEffect, useId, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { ListBullets } from '@phosphor-icons/react';
import usePopper from '@/hooks/usePopper';
import { ContainedButton } from '@/ui-kit/buttons';
import { X } from '@phosphor-icons/react';
import { Theme } from '@mui/system';
import dynamic from 'next/dynamic';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';

const NavCatalogBtnPopper = dynamic(() => import('./NavCatalogBtnPopper'));

const NavCatalogBtn = () => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const id = useId();
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const {
    handleClick,
    handleClickAway,
    open: isOpenPopper,
    id: popperId,
    anchorEl,
    handleClose,
  } = usePopper(`${id}-navbar-popper`);

  useEffect(() => {
    if (isOpenPopper && !isFirstOpen) {
      setIsFirstOpen(true);
    }
  }, [isFirstOpen, isOpenPopper]);

  useNavigationEvent(() => {
    handleClose();
  });

  return (
    <>
      <ContainedButton
        aria-haspopup="true"
        aria-expanded={isOpenPopper ? 'true' : undefined}
        aria-controls={popperId}
        startIcon={
          isOpenPopper ? (
            <X color="#fff" weight="bold" />
          ) : (
            <ListBullets weight="bold" />
          )
        }
        className="min-w-[150px]"
        onClick={handleClick}
      >
        Catalog
      </ContainedButton>
      {isDesktop && isFirstOpen && (
        <NavCatalogBtnPopper
          id={popperId}
          anchorEl={anchorEl}
          handleClickAway={handleClickAway}
          handleClose={handleClose}
          open={isOpenPopper}
        />
      )}
    </>
  );
};

export default NavCatalogBtn;
