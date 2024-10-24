import Stack from '@mui/material/Stack';
import { Button, Typography, Pagination } from '@mui/material';
import { Menu, MenuItem } from '../menu';
import { CaretDown } from '@phosphor-icons/react';
import useMenu from '@/hooks/useMenu';
import { getPaginationCount } from '@/utils/pagination';

interface DropdownPaginationProps {
  total: number;
  page: number;
  perPage: number;
  perPageOptions?: (number | { label: string; value: number })[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function DropdownPagination({
  total,
  page,
  perPage,
  perPageOptions = [5, 10, 15, 20],
  onPageChange,
  onPerPageChange,
}: DropdownPaginationProps) {
  const { open, anchorEl, handleClick, handleClose, menuId, buttonId } =
    useMenu();

  const { count, offsetEnd, offsetStart } = getPaginationCount({
    total,
    page,
    perPage,
  });

  return (
    <div className="my-6 items-center justify-between sm:flex">
      <div className="hidden sm:block">
        <Typography
          sx={{
            fontSize: '16px',
            lineHeight: '24px',
            color: 'text.primary',
          }}
        >
          {offsetStart}-{offsetEnd} of {total}
        </Typography>
      </div>

      <Stack spacing={2}>
        <Pagination
          sx={{
            '& ul': {
              justifyContent: 'center',
              alignItems: 'center',
              width: {
                xs: '100%',
                sm: 'auto',
              },
            },
          }}
          count={count}
          page={page}
          color="primary"
          shape="rounded"
          siblingCount={0}
          onChange={(_e, page) => onPageChange(page)}
        />
      </Stack>
      <div className="hidden items-center sm:flex">
        <Typography
          sx={{
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 400,
            color: 'text.primary',
          }}
        >
          Per page:
        </Typography>
        <Button
          variant="text"
          className="pl-0"
          id={buttonId}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <span className="text-base/6 font-normal text-text-primary">
            {perPage}
          </span>
          <div className="ml-2.5 flex items-center text-text-primary">
            <CaretDown size={12} />
          </div>
        </Button>
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': buttonId,
          }}
          sx={{
            '& .MuiPaper-root': {
              width: 'auto',
            },
          }}
        >
          {perPageOptions.map((option) => (
            <MenuItem
              key={typeof option === 'number' ? option : option.label}
              onClick={() => {
                onPerPageChange(
                  typeof option === 'number' ? option : option.value,
                );
                handleClose();
              }}
              selected={option === perPage}
            >
              {typeof option === 'number' ? option : option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
}
