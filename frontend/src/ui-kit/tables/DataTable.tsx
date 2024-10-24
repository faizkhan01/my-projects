import {
  Box,
  Card,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  useGridApiContext,
  useGridSelector,
  gridPaginationSelector,
  ColumnHeaderFilterIconButtonProps,
  GridPreferencePanelsValue,
  gridRowCountSelector,
  gridPreferencePanelStateSelector,
  useGridRootProps,
} from '@mui/x-data-grid';
import {
  ChangeEvent,
  useEffect,
  useState,
  useCallback,
  MouseEvent,
} from 'react';
import { SearchInput } from '../inputs';
import { DropdownPagination } from '../pagination/DropdownPagination';
import { FilterButton } from '../buttons/FilterButton';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { DotsThreeOutlineVertical, Funnel } from '@phosphor-icons/react';
import { useDebounce } from '@/hooks/useDebounce';

interface Props extends DataGridProps {
  title?: string;
  hideToolbar?: boolean;
  onSearch?: (value: string) => void;
  sxDataGridContainer?: SxProps<Theme>;
}

const StyledCard = styled(Card)(() => ({
  backgroundColor: 'common.white',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
}));

const ColumnHeaderFilterIconButton = ({
  field,
  onClick,
  counter,
}: ColumnHeaderFilterIconButtonProps) => {
  const apiRef = useGridApiContext();

  const toggleFilter = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const { open, openedPanelValue } = gridPreferencePanelStateSelector(
        apiRef.current.state,
      );

      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        apiRef.current.showFilterPanel();
      }

      if (onClick) {
        onClick(apiRef.current.getColumnHeaderParams(field), event);
      }
    },
    [apiRef, field, onClick],
  );

  if (!counter) {
    return null;
  }

  return (
    <Tooltip
      title={apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
        counter,
      )}
    >
      <IconButton
        size="small"
        onClick={toggleFilter}
        aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      >
        <Funnel size={16} />
      </IconButton>
    </Tooltip>
  );
};

const CustomToolbar = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const apiRef = useGridApiContext();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      debouncedSearchValue.split(' ').filter((word) => word !== ''),
    );
  }, [apiRef, debouncedSearchValue]);

  return (
    <>
      <Divider />
      <Box
        sx={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <FilterButton
          className="min-w-[109px]"
          onClick={() => apiRef.current.showFilterPanel()}
          selected
        >
          Filters | 0
        </FilterButton>
        <Box
          sx={{
            flexGrow: 2,
            borderRadius: '4px',
          }}
        >
          <SearchInput
            value={searchValue}
            sx={{
              width: '100%',
              height: '40px',
            }}
            label="Search"
            placeholder="Search"
            onChange={handleSearch}
            hideSearchButton
          />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

// This implementation allows an easier use of server mode
// https://mui.com/x/react-data-grid/pagination/#basic-implementation
const Footer = ({ onPaginationModelChange }: Props) => {
  const apiRef = useGridApiContext();
  const {
    paginationModel: { page, pageSize },
  } = useGridSelector(apiRef, gridPaginationSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const { pageSizeOptions = [10, 25, 50] } = useGridRootProps();

  return (
    <Box
      sx={{
        padding: '0 24px',
        display: 'flex',
        justifyContent: {
          xs: 'center',
          md: 'space-between',
        },

        '& > div': {
          width: {
            md: '100%',
          },
        },
      }}
    >
      <DropdownPagination
        page={page + 1}
        onPageChange={(page) =>
          onPaginationModelChange
            ? onPaginationModelChange({ page, pageSize }, { reason: undefined })
            : apiRef.current.setPage(page - 1)
        }
        onPerPageChange={(size) =>
          onPaginationModelChange
            ? onPaginationModelChange({ page, pageSize }, { reason: undefined })
            : apiRef.current.setPageSize(size)
        }
        perPage={pageSize}
        perPageOptions={pageSizeOptions}
        total={rowCount}
      />
    </Box>
  );
};

export const DataTable = ({
  title,
  sxDataGridContainer,
  hideToolbar = false,
  ...props
}: Props) => {
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

      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-cell': {
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '18px',
          },

          '& .MuiDataGrid-root': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: '#EAECF4',
          },

          // ------ This is for cases when using getRowHeight
          '& .MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: '8px',
          },
          '& .MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '& .MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
          // --------------------

          '& .MuiDataGrid-row': {
            borderBottom: '1px solid',
            borderColor: '#EAECF4',

            ...(!props.checkboxSelection
              ? {
                  paddingLeft: '14px',
                }
              : {}),
          },

          '& .MuiDataGrid-cell:first-of-type': {
            ...(props.checkboxSelection === true
              ? {
                  marginLeft: '8px',
                }
              : {}),
          },

          '& .MuiDataGrid-columnHeadersInner': {
            ...(props.checkboxSelection === true
              ? { paddingLeft: '8px' }
              : { paddingLeft: '14px' }),
          },

          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '18px',
            color: '#96A2C1',
          },
          '& .MuiDataGrid-root .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          ...sxDataGridContainer,
        }}
      >
        <DataGrid
          disableColumnMenu
          rowHeight={88}
          slots={{
            footer: Footer,
            toolbar: hideToolbar ? null : CustomToolbar,
            columnHeaderFilterIconButton: ColumnHeaderFilterIconButton,
            openFilterButtonIcon: () => null,
            moreActionsIcon: () => (
              <DotsThreeOutlineVertical size={18} weight="fill" />
            ),
            ...props?.slots,
          }}
          {...props}
        />
      </Box>
    </StyledCard>
  );
};
