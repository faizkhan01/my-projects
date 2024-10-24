import { Box, Card, Typography, useMediaQuery, Theme } from '@mui/material';
import { DataGridProps, DataGridToolbarProps, DataGrid } from './DataGrid';
import { styled } from '@mui/material/styles';
import { SearchInput } from '../inputs';
import { useEffect, useState } from 'react';
import { FilterButton } from '../buttons/FilterButton';
import { useDebounce } from '@/hooks/useDebounce';

interface DataTableProps<T> extends DataGridProps<T> {
  title?: string;
  hideToolbar?: boolean;
  onSearch?: (value: string) => void;
  hideOnMobile?: boolean;
  tableHeight?: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow: 'none',
  borderRadius: '10px',
}));

const Toolbar = <T,>({ setGlobalFilter }: DataGridToolbarProps<T>) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    setGlobalFilter(debouncedSearchValue);
  }, [debouncedSearchValue, setGlobalFilter]);

  return (
    <div className="flex items-center gap-6 p-6">
      <FilterButton
        className="min-w-[109px]"
        // onClick={() => apiRef.current.showFilterPanel()}
        selected
      >
        Filters | 0
      </FilterButton>

      <div className="grow-[2] rounded-[4px]">
        <SearchInput
          // value={searchValue}
          className="h-10 w-full"
          label="Search"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          hideSearchButton
        />
      </div>
    </div>
  );
};

export const NewDataTable = <T,>({
  title,
  tableHeight,
  slots,
  ...props
}: DataTableProps<T>) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  if (props.hideOnMobile && isMobile) {
    return null;
  }
  return (
    <StyledCard>
      {title && (
        <Box
          sx={{
            display: 'flex',
            padding: '24px',
            paddingBottom: '0px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '24px',
              borderBottom: '1px solid #5F59FF',
              paddingBottom: '16px',
            }}
          >
            {title}
          </Typography>
        </Box>
      )}

      <div
        className="h-full"
        style={{
          height: tableHeight ? `${tableHeight}px` : 'auto',
        }}
      >
        <DataGrid
          slots={{
            toolbar: Toolbar,
            ...slots,
          }}
          {...props}
        />
      </div>
    </StyledCard>
  );
};
