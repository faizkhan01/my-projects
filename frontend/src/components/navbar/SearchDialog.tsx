import {
  ReactElement,
  Ref,
  forwardRef,
  useState,
  useRef,
  useEffect,
  FormEvent,
} from 'react';
import {
  Box,
  ButtonBase,
  Dialog,
  MenuList,
  MenuItem,
  Typography,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FormInput, FormInputProps } from '@/ui-kit/inputs';
import {
  X,
  MagnifyingGlass,
  CaretRight,
  ArrowLeft,
} from '@phosphor-icons/react';
import { useProductSuggestionsAutocomplete } from '@/hooks/queries/useProductSuggestionsAutocomplete';

interface SearchDialogProps {
  initialSearch?: string;
  open: boolean;
  onClose: () => void;
  onSearch: (search: string) => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SearchInput = forwardRef<
  HTMLInputElement,
  FormInputProps & {
    onClear?: () => void;
  }
>(({ onClear, ...props }, ref) => {
  return (
    <FormInput
      sx={{
        margin: '0 8px 0 12px',
        flex: 1,
        borderRadius: '4px',
        background: '#F6F9FF',
        border: 0,
      }}
      type="search"
      hideLabel
      startAdornment={
        <Box
          component="span"
          sx={{
            color: '#C5CCDE',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MagnifyingGlass size={20} />
        </Box>
      }
      startAdornmentProps={{
        disablePointerEvents: true,
      }}
      endAdornment={
        <ButtonBase
          sx={{
            color: '#96A2C1',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '50%',
          }}
          onClick={onClear}
          focusRipple
        >
          <X size={16} />
        </ButtonBase>
      }
      endAdornmentProps={{
        sx: {
          paddingRight: '8px !important',
        },
      }}
      ref={ref}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

const GoBackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <ButtonBase
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        color: 'text.primary',
      }}
      onClick={onClick}
      focusRipple
    >
      <ArrowLeft size={24} />
    </ButtonBase>
  );
};

const SearchDialog = ({
  initialSearch,
  open,
  onClose,
  onSearch,
}: SearchDialogProps): JSX.Element => {
  const [search, setSearch] = useState('');
  const { data: autocompleteData } = useProductSuggestionsAutocomplete(search);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(search);
  };

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      searchRef?.current?.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            marginBottom: '16px',
            display: 'flex',
            pt: '16px',
            px: '16px',
          }}
        >
          <GoBackButton onClick={onClose} />
          <Box sx={{ flex: 1 }}>
            <form onSubmit={handleSearch}>
              <SearchInput
                id="search-products"
                label="Search Products"
                placeholder="Search for a product"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onClear={() => setSearch('')}
                inputProps={{
                  autoComplete: 'off',
                }}
                ref={searchRef}
              />
            </form>
          </Box>
          {/* <ButtonBase */}
          {/*   sx={{ */}
          {/*     padding: '12px', */}
          {/*     borderRadius: '4px', */}
          {/*     background: '#F6F9FF', */}
          {/*   }} */}
          {/*   aria-label="Filter" */}
          {/*   focusRipple */}
          {/*   onClick={handleOpenCategories} */}
          {/* > */}
          {/*   <Badge badgeContent={1} color="error"> */}
          {/*     <Funnel size={20} /> */}
          {/*   </Badge> */}
          {/* </ButtonBase> */}
        </Box>
        <MenuList sx={{ padding: 0 }}>
          {autocompleteData.map((suggestion) => (
            <MenuItem
              sx={{
                display: 'flex',
                px: '16px',
                py: 0,
              }}
              key={suggestion.id}
              onClick={() => onSearch(suggestion.keyword)}
            >
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: '#EAECF4',
                  display: 'flex',
                  height: '100%',
                  width: '100%',
                  gap: '8px',
                  alignItems: 'center',
                  py: '16px',
                }}
              >
                <Box
                  sx={{
                    color: '#C5CCDE',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  component="span"
                >
                  <MagnifyingGlass size={20} />
                </Box>
                <Typography
                  component="span"
                  fontWeight="500"
                  dangerouslySetInnerHTML={{
                    __html: suggestion?.highlight ?? suggestion.keyword,
                  }}
                ></Typography>
                <Box ml="auto" color="#96A2C1" component="span">
                  <CaretRight size={18} />
                </Box>
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Dialog>
    </>
  );
};

export default SearchDialog;
