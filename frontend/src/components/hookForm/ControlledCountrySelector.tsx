import { ComponentProps, useMemo, useState } from 'react';
import { FormInput } from '@/ui-kit/inputs';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Autocomplete, Box, Chip } from '@mui/material';
import useCountries, {
  userSellerCountries,
} from '@/hooks/queries/useCountries';
import { CaretDown } from '@phosphor-icons/react';
import { Country } from '@/types/countries';
import { getCountryFromList } from '@/utils/countries';

interface Props<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<ComponentProps<typeof FormInput>, 'defaultValue'> {
  type?: 'all' | 'seller_available';
  loadingOnOpen?: boolean;
  multiple?: boolean;
  getFilteredCountries?: (countries: Country[]) => Country[];
  onChangeSend?: 'id' | 'iso2' | 'iso3';
}

type ControlledCountrySelectorType = <T extends FieldValues>(
  p: Props<T>,
) => React.ReactElement<Props<T>>;

const getCountryName = (iso2: string) => {
  return new Intl.DisplayNames([], {
    type: 'region',
  }).of(iso2);
};

const ControlledCountrySelector: ControlledCountrySelectorType = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  type = 'all',
  disabled,
  loadingOnOpen = false,
  multiple = false,
  getFilteredCountries,
  onChangeSend = 'id',
  ...props
}) => {
  const [firstOpen, setFirstOpen] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
  });

  const shouldLoad: boolean = useMemo(() => {
    if (loadingOnOpen) {
      return firstOpen;
    }
    return true;
  }, [firstOpen, loadingOnOpen]);

  const countriesHook =
    type === 'seller_available' ? userSellerCountries : useCountries;

  const { countries = [], isLoading } = countriesHook(shouldLoad);
  const value: Country[] | Country | null = useMemo(() => {
    if (multiple) {
      return countries.filter((c) => {
        return (
          field.value?.includes(c.id) ||
          field.value?.includes(c.iso2) ||
          field.value?.includes(c.iso3)
        );
      });
    }

    return getCountryFromList(countries, field.value) || null;
  }, [countries, field.value, multiple]);

  const countryOptions = useMemo(() => {
    let countriesWithNewName = countries.map((c) => {
      return { ...c, name: getCountryName(c.iso2) ?? '' };
    });

    if (getFilteredCountries) {
      countriesWithNewName = getFilteredCountries(countriesWithNewName);
    }

    return countriesWithNewName.sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, getFilteredCountries]);

  return (
    <Autocomplete
      value={value}
      options={countryOptions}
      loading={isLoading}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => {
        const result = getCountryFromList([option], value);
        return Boolean(result);
      }}
      getOptionLabel={(option) => getCountryName(option.iso2) ?? ''}
      multiple={multiple}
      // onChange is required to can update the form
      onChange={(_event, value) => {
        const sendValue = (value: Country | null) => {
          if (!value) return null;
          if (onChangeSend === 'id') return value?.id;
          if (onChangeSend === 'iso2') return value?.iso2;
          if (onChangeSend === 'iso3') return value?.iso3;
        };

        Array.isArray(value)
          ? field.onChange(value.map(sendValue))
          : field.onChange(sendValue(value));
      }}
      onOpen={() => setFirstOpen(true)}
      renderTags={(value, getTagProps) =>
        value.map((option, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <Chip
            variant="outlined"
            avatar={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.emoji}
              </Box>
            }
            label={option.name}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => {
        const hasValue =
          params.inputProps['aria-expanded'] === false &&
          params.inputProps['value'];
        const disabled = params?.disabled;

        const copyField: Partial<typeof field> = { ...field };
        // we need to delete onChange because it causes the form to take any value
        delete copyField.onChange;

        return (
          <FormInput
            {...copyField}
            {...props}
            {...params}
            ref={params.InputProps.ref}
            errorMessage={error?.message}
            sx={{
              ...(disabled
                ? {}
                : {
                    '& .MuiAutocomplete-input:hover': {
                      cursor: hasValue ? 'pointer' : 'text',
                    },
                  }),
            }}
            startAdornment={
              hasValue ? (
                <Box
                  role="img"
                  component="span"
                  sx={{
                    color: 'black',
                  }}
                >
                  {getCountryFromList(countries, field.value)?.emoji}
                </Box>
              ) : null
            }
            endAdornmentProps={{
              disablePointerEvents: true,
            }}
            endAdornment={
              disabled ? null : <CaretDown size={18} color="#333E5C" />
            }
          />
        );
      }}
      blurOnSelect
      renderOption={(props, option) => {
        const name = option.name ?? '';
        return (
          <Box component="li" {...props} key={`${option.id}-${option.iso2}`}>
            <Box
              component="span"
              role="img"
              sx={{
                marginRight: 1,
              }}
              aria-label={name}
            >
              {option.emoji}
            </Box>
            {name}
          </Box>
        );
      }}
    />
  );
};

export default ControlledCountrySelector;
