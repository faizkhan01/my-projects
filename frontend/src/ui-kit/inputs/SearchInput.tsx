'use client';
import { forwardRef } from 'react';
import {
  FormControl,
  InputBase,
  InputBaseComponentProps,
  InputBaseProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ContainedButton } from '../buttons/ContainedButton';

type SearchInputProps = {
  label: string;
  hideSearchButton?: boolean;
  inputProps?: InputBaseComponentProps;
  InputProps?: InputBaseProps;
} & Pick<
  InputBaseProps,
  | 'value'
  | 'onChange'
  | 'placeholder'
  | 'sx'
  | 'onBlur'
  | 'onFocus'
  | 'className'
>;

const StyledControl = styled(FormControl)(({ theme }) => ({
  maxHeight: '40px',
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[50],
  width: '100%',
  padding: '11px 0',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: 16,
  lineHeight: 1.125,
  paddingLeft: '16px',
  color: theme.palette.text.primary,

  // Deletes the X icon on Chrome browsers
  '& ::-webkit-search-decoration, & ::-webkit-search-cancel-button, & ::-webkit-search-results-button, & ::-webkit-search-results-decoration':
    {
      WebkitAppearance: 'none',
    },
}));

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder,
      label,
      sx,
      onChange,
      onBlur,
      value,
      hideSearchButton,
      onFocus,
      InputProps,
      inputProps,
      className,
      ...props
    },
    ref,
  ): JSX.Element => {
    return (
      <StyledControl sx={sx} className={className}>
        <StyledInput
          placeholder={placeholder}
          inputRef={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          type="search"
          onFocus={onFocus}
          aria-label={label}
          {...props}
          inputProps={inputProps}
          {...InputProps}
        />
        {!hideSearchButton ? (
          <ContainedButton
            className="-mt-[11px] rounded-[0_2px_2px_0]"
            type="submit"
          >
            Search
          </ContainedButton>
        ) : null}
      </StyledControl>
    );
  },
);

SearchInput.displayName = 'SearchInput';
