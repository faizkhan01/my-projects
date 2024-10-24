'use client';
import { styled } from '@mui/material/styles';
import { Autocomplete, Divider, ListItemText } from '@mui/material';
import { SearchInput } from '@/ui-kit/inputs';
import { useRouter } from 'next/navigation';
import routes from '@/constants/routes';
import useCategories from '@/hooks/queries/useCategories';
import { useCallback, useRef, useState } from 'react';
import { CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import NavCategoryBtn from './NavCategoryBtn';
import { ContainedButton } from '@/ui-kit/buttons';
import { useProductSuggestionsAutocomplete } from '@/hooks/queries/useProductSuggestionsAutocomplete';
import { cx } from 'cva';

const StyledFlexBox = styled('div')(({ theme }) => ({
  maxHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[50],
  width: '100%',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  height: '30px',
  paddingLeft: '16px',
  color: theme.palette.text.primary,
}));

const NavbarSearch = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const { data: autocompleteData } = useProductSuggestionsAutocomplete(search);

  const formRef = useRef<HTMLFormElement>(null);

  const { push } = useRouter();
  const [selectedId, setSelectedId] = useState<null | number>(null);
  const { categories = [] } = useCategories();

  const executeSearch = useCallback(
    async (term: string) => {
      if (term.trim().length === 0 && !selectedId) return;

      const category = selectedId
        ? categories.find((c) => c.id === selectedId)?.name
        : null;

      if (!category) {
        push(
          routes.SEARCH.INDEX({
            q: term,
          }),
        );
      } else {
        push(
          routes.SEARCH.INDEX({
            q: term,
            category: category,
          }),
        );
      }
    },

    [categories, push, selectedId],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch(search);
  };

  return (
    <StyledFlexBox>
      <NavCategoryBtn setSelected={setSelectedId} selectedId={selectedId} />

      <StyledDivider orientation="vertical" />
      <form className="relative flex flex-1" onSubmit={onSubmit} ref={formRef}>
        <Autocomplete
          className="flex-1 [&_.MuiAutocomplete-inputRoot]:py-0"
          options={autocompleteData}
          disablePortal
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.keyword
          }
          clearOnBlur={false}
          openOnFocus
          freeSolo
          onInputChange={(_, newValue) => {
            setSearch(newValue);
          }}
          value={null}
          onChange={(_, newValue) => {
            if (newValue) {
              const value =
                typeof newValue === 'string' ? newValue : newValue.keyword;
              setSearch(value);
              executeSearch(value);
            }
          }}
          slotProps={{
            paper: {
              // Style the paper (the component that holds the list of options)
              className: cx(
                'mt-[26px] rounded-[8px] border-none shadow-[0px_4px_103px_rgba(0,0,0,0.02),_0px_1.46007px_37.5967px_rgba(0,0,0,0.0137996),_0px_0.708835px_18.2525px_rgba(0,0,0,0.0111258),_0px_0.347484px_8.94771px_rgba(0,0,0,0.00887419),_0px_0.137396px_3.53794px_rgba(0,0,0,0.00620037)] outline-none',
                '[&_.MuiAutocomplete-listbox]:max-h-none [&_.MuiAutocomplete-listbox]:p-0',
              ),
              style: {
                width: `${formRef.current?.offsetWidth}px`,
              },
            },
          }}
          renderOption={(props, option, state) => {
            return (
              <li
                {...props}
                className={cx(
                  props?.className,
                  'flex items-center px-5 py-[18px]',
                  state?.index !== 0 && 'border border-solid border-[#EAECF4]',
                  state?.index === 0 && 'mt-5',
                  state?.index === 5 && 'mb-5',
                )}
                key={`${option?.id}-option`}
              >
                <div className="mr-2 flex h-fit text-text-secondary">
                  <MagnifyingGlass size={14} color="#C5CCDE" />
                </div>
                <ListItemText className="text-[14px] font-medium leading-4 text-[#333E5C]">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: option?.highlight ?? option?.keyword,
                    }}
                  />
                </ListItemText>
                <div className="ml-2 flex h-fit text-text-secondary">
                  <CaretRight size={14} color="#C5CCDE" />
                </div>
              </li>
            );
          }}
          clearIcon={false}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          renderInput={({ InputLabelProps, ...params }) => {
            delete params.InputProps.endAdornment;
            return (
              <SearchInput
                {...params}
                className="h-full p-0"
                label="Search on Only Latest"
                placeholder="Search on Only Latest"
                hideSearchButton
              />
            );
          }}
        />
        <ContainedButton className="min-w-[111px]" type="submit">
          Search
        </ContainedButton>
      </form>
    </StyledFlexBox>
  );
};

export default NavbarSearch;
