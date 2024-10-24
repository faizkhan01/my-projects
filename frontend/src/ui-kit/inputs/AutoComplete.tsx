import { CaretDown } from '@phosphor-icons/react';
import { FormInput } from './FormInput';
import { Autocomplete } from '@mui/material';

/* INFO: This component is just for showcase how it looks, because the Autocomplete component */
/* of MUI is very complex and it's hard to make reusable. */
/* So it's better to use the Autocomplete component of MUI directly. */
export default function AutoComplete() {
  // define countries
  const countries = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    { code: 'AE', label: 'United Arab Emirates', phone: '971' },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1-684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    { code: 'AU', label: 'Australia', phone: '61' },
    { code: 'AW', label: 'Aruba', phone: '297' },
    { code: 'AX', label: 'Alland Islands', phone: '358' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    { code: 'BA', label: 'Bosnia and Herzegovina', phone: '387' },
    { code: 'BB', label: 'Barbados', phone: '1-246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
  ];

  return (
    <Autocomplete
      options={countries}
      id="countries"
      renderInput={(params) => {
        return (
          <FormInput
            {...params}
            label="Country"
            placeholder="Select a country"
            // the ref is required to can show the listBox, without this, it won't show anything
            ref={params.InputProps.ref}
            endAdornment={<CaretDown size={18} color="#333E5C" />}
          />
        );
      }}
    />
  );
}
