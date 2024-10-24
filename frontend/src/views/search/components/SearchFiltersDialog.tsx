import { useRouteReplace } from '@/hooks/queries/useRouteReplace';
import { Category } from '@/types/categories';
import { ProductFilters } from '@/types/products';
import { Dialog, Slide, Box, Button } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, X } from '@phosphor-icons/react';
import { forwardRef, useEffect, useState } from 'react';
import { SelectedFilters } from '../Search';
import { SearchFilters } from './SearchFilters';
import { ContainedButton } from '@/ui-kit/buttons';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SearchFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  filters: ProductFilters | null;
  isLoading: boolean;
  onFiltersChange: (data: SelectedFilters) => void;
  selectedFilters: SelectedFilters;
}

const SearchFiltersDialog = ({
  open,
  onClose,
  categories,
  filters,
  isLoading,
  onFiltersChange,
  selectedFilters,
}: SearchFiltersDialogProps) => {
  const query = useSearchParams();
  const { replace } = useRouteReplace();
  const [ownSelectedFilters, setOwnSelectedFilters] =
    useState<SelectedFilters | null>(null);

  const handleClearAll = () => {
    const q = query.get('q');
    const category = query.get('category');
    if (q) {
      replace({
        q: q as string,
      });
    } else if (category) {
      replace({
        category: category as string,
      });
    }
    onClose();
  };

  useEffect(() => {
    setOwnSelectedFilters(selectedFilters);
  }, [selectedFilters]);

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <Box
        sx={{
          backgroundColor: 'primary.main',
          height: '55px',
          p: '18px 16px',
          color: 'common.white',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        <Button
          startIcon={<ArrowLeft size={14} weight="bold" />}
          color="inherit"
          onClick={onClose}
        >
          Filter
        </Button>
        <Button
          startIcon={<X size={14} />}
          color="inherit"
          sx={{
            fontWeight: '400',
          }}
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      </Box>

      <Box
        sx={{
          p: '24px 16px',
        }}
      >
        <SearchFilters
          categories={categories ?? []}
          filters={filters || null}
          isLoading={isLoading}
          selectedFilters={ownSelectedFilters || selectedFilters}
          onFiltersChange={(data) =>
            setOwnSelectedFilters((old) => ({ ...old, ...data }))
          }
        />
      </Box>
      <Box
        sx={{
          backgroundColor: 'common.white',
          p: '16px',
          boxShadow: '0px -10px 20px 0px #0000000A',
          position: 'sticky',
          marginTop: 'auto',
          bottom: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        <ContainedButton
          size="large"
          fullWidth
          onClick={() => {
            if (ownSelectedFilters) {
              onFiltersChange(ownSelectedFilters);
              onClose();
            }
          }}
        >
          Apply
        </ContainedButton>
      </Box>
    </Dialog>
  );
};

export default SearchFiltersDialog;
