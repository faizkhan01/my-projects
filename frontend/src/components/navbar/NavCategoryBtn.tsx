import { memo, useEffect, useId, useMemo, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import usePopper from '@/hooks/usePopper';
import { Theme } from '@mui/system';
import dynamic from 'next/dynamic';

import { CaretDown } from '@phosphor-icons/react';
import useCategories from '@/hooks/queries/useCategories';
import { Category } from '@/types/categories';
import { Button } from '@/ui-kit/buttons';
import { cx } from 'cva';

const NavCategoryBtnPopper = dynamic(() => import('./NavCategoryBtnPopper'));

interface NavCategoryButtonType {
  setSelected: (id: number | null) => void;
  selectedId: number | null;
}

const NavCategoryBtn = memo(
  ({ setSelected, selectedId }: NavCategoryButtonType) => {
    const isDesktop = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up('lg'),
    );
    const { categories = [] } = useCategories();

    const onSelectCategory = (category: Category | null) => {
      setSelected?.(category?.id ?? null);
    };

    const selectedCategory = useMemo(() => {
      return categories.find((c) => c.id === selectedId) ?? null;
    }, [categories, selectedId]);

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

    return (
      <>
        <Button
          color="inherit"
          className="min-w-0 whitespace-nowrap text-base font-medium"
          endIcon={
            <CaretDown
              size={16}
              className={cx(
                'transition-transform duration-200',
                isOpenPopper && 'rotate-180',
              )}
            />
          }
          onClick={handleClick}
        >
          {selectedCategory?.name ?? 'All Categories'}
        </Button>
        {isDesktop && isFirstOpen && (
          <NavCategoryBtnPopper
            id={popperId}
            anchorEl={anchorEl}
            handleClickAway={handleClickAway}
            handleClose={handleClose}
            open={isOpenPopper}
            categories={categories}
            onSelectCategory={onSelectCategory}
          />
        )}
      </>
    );
  },
);

export default NavCategoryBtn;

NavCategoryBtn.displayName = 'NavCategoryBtn';
