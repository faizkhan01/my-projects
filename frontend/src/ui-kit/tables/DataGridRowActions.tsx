import dynamic from 'next/dynamic';
import useMenu from '@/hooks/useMenu';
import { IconButton } from '@mui/material';
import { DotsThreeOutlineVertical } from '@phosphor-icons/react';

import { CellContext } from '@tanstack/react-table';
import { ReactElement, ComponentProps, JSXElementConstructor } from 'react';
import type { MenuItemProps, MenuProps } from '../menu';
import { cx } from 'cva';

const Menu = dynamic<MenuProps>(() =>
  import('../menu/Menu').then((e) => e.Menu),
);
const MenuItem = dynamic<MenuItemProps>(() =>
  import('../menu/MenuItem').then((e) => e.MenuItem),
);

export const DataGridRowActions = <T,>({
  actions,
  className = '',
  column,
}: CellContext<T, unknown> & {
  actions: ReactElement<
    ComponentProps<typeof DataGridRowAction>,
    string | JSXElementConstructor<unknown>
  >[];
  className?: string;
}) => {
  const { buttonAria, menuAria, handleClose, open, handleClick, anchorEl } =
    useMenu();

  const rowActionsInMenu: typeof actions = [];
  const rowActionsInRow: typeof actions = [];

  for (const a of actions) {
    const type = a.type as typeof DataGridRowAction;
    if (
      // without type.name it won't work when making dev changes
      Boolean(
        type === DataGridRowAction || type?.name === DataGridRowAction.name,
      ) &&
      a.props.showInMenu
    ) {
      rowActionsInMenu.push(a);
    } else {
      rowActionsInRow.push(a);
    }
  }
  const align = column.columnDef.meta?.align || 'left';

  return (
    <div
      className={cx([
        `flex flex-1 items-center gap-2`,
        [
          align === 'right' && 'md:justify-end',
          align === 'center' && 'md:justify-center',
          align === 'left' && 'md:justify-start',
        ],
        className,
      ])}
    >
      {rowActionsInRow.map((a) => a)}
      {!!rowActionsInMenu.length && (
        <>
          <IconButton
            aria-label="Open Menu"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleClick(e);
            }}
            {...buttonAria}
          >
            <DotsThreeOutlineVertical size={18} weight="fill" />
          </IconButton>
          <Menu
            usePopper
            role={undefined}
            open={open}
            anchorEl={anchorEl}
            {...menuAria}
            onClose={handleClose}
            slotProps={{
              paper: {
                className: 'w-auto py-2 px-0',
              },
            }}
            placement="bottom-end"
          >
            {rowActionsInMenu.map((a) => a)}
          </Menu>
        </>
      )}
    </div>
  );
};

const DataGridRowAction = ({
  label,
  icon: Icon,
  onClick,
  showInMenu,
  ...props
}: {
  label: string;
  icon?: ReactElement;
  showInMenu?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  if (showInMenu) {
    return (
      <MenuItem
        className="gap-2 px-4 py-1.5 text-sm"
        onClick={onClick}
        {...props}
      >
        {Icon}
        {label}
      </MenuItem>
    );
  }

  return (
    <IconButton aria-label={label} onClick={onClick} {...props}>
      {Icon}
    </IconButton>
  );
};

DataGridRowActions.Action = DataGridRowAction;
