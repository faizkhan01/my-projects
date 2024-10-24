import { showErrorSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
  Grid,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ControlledAutocomplete } from '../hookForm/ControlledAutocomplete';
import ControlledCountrySelector from '../hookForm/ControlledCountrySelector';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { ShippingProfileFormValues } from '@/types/shippingProfiles';
import { getConfirmedAreas } from './utils';
import { Country } from '@/types/countries';
import { useSellerCurrency } from '@/hooks/queries/useProfile';
import { useMemo } from 'react';
import { getCurrencySymbol } from '@/utils/currency';

interface AssignShippingCountriesModalProps {
  prefix?: string;
  areas: ShippingProfileFormValues['areas'];
  open: boolean;
  onClose: () => void;
  methods: Pick<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UseFormReturn<any>,
    'control' | 'setValue' | 'getValues' | 'watch' | 'trigger'
  >;
}

const AssignShippingCountriesModal = ({
  prefix = '',
  open,
  onClose,
  areas,
  methods: { control, setValue, getValues, watch, trigger },
}: AssignShippingCountriesModalProps) => {
  const currency = useSellerCurrency();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol({ currency });
  }, [currency]);

  const modalPath = `${prefix}areas.${
    areas.length !== 0 ? areas.length - 1 : 0
  }`;

  const everyWhere = watch(`${modalPath}.everyWhere`);

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer
        title="Assign Country"
        minWidth="auto"
        titleSx={{
          textAlign: {
            xs: 'left',
            sm: 'center',
          },
        }}
      >
        <Box
          sx={{
            mt: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <ControlledCountrySelector
            name={`${modalPath}.countryIds`}
            control={control}
            multiple
            label="Countries"
            placeholder="Select countries"
            disabled={everyWhere}
            loadingOnOpen={false}
            helperText={
              everyWhere &&
              'This will be omitted because your marked "Rest of the world"'
            }
          />
          <Controller
            name={`${modalPath}.everyWhere`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl {...field}>
                <FormLabel>Quick Pick</FormLabel>
                <FormControlLabel
                  sx={{
                    position: 'relative',
                    margin: 0,
                  }}
                  disableTypography
                  control={
                    <Checkbox
                      sx={{
                        position: 'absolute',
                        top: '16px',
                        right: '15px',
                        width: '18px',
                        height: '18px',
                        p: 0,
                      }}
                      checked={field.value}
                    />
                  }
                  label={
                    <Stack
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.400',
                        padding: '12px 31px 12px 16px',
                        width: '100%',
                      }}
                    >
                      <Typography fontWeight="bold">
                        Rest of the world.
                      </Typography>
                      <br />
                      <Typography>
                        If selected, this will add all of the available
                        countries <br />
                        that are not already selected.
                      </Typography>
                    </Stack>
                  }
                />
                {error?.message && (
                  <FormHelperText error>{error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <ControlledAutocomplete
            name={`${modalPath}.carrier`}
            control={control}
            options={['UPS', 'FedEx', 'Canada Post', 'DHL']}
            freeSolo
            label="Shipping carrier"
            autoHighlight
            placeholder="Choose a carrier"
            helperText="If you don't see your carrier, add it manually"
          />
          <ControlledFormInput
            name={`${modalPath}.price`}
            type="number"
            control={control}
            label="Shipping price"
            inputProps={{
              min: 0,
            }}
            startAdornment={currencySymbol}
            helperText="Leave as zero for free shipping"
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ControlledFormInput
                name={`${modalPath}.minDays`}
                type="number"
                control={control}
                label="Min delivery days"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlledFormInput
                name={`${modalPath}.maxDays`}
                type="number"
                control={control}
                label="Max delivery days"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
          </Grid>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-6">
            <ContainedButton
              size="large"
              fullWidth
              onClick={async () => {
                const isValid = await trigger(`${modalPath}`);

                if (!isValid) return;

                const everyWhere = getValues(`${modalPath}.everyWhere`);
                let countryIds: number[] | undefined = getValues(
                  `${modalPath}.countryIds`,
                );

                if (!countryIds?.length) {
                  const countries = getValues(`${modalPath}.countries`);
                  countryIds = countries?.map((c: Country) => c.id);
                }

                if (!everyWhere && countryIds?.some((id) => id <= 0)) {
                  return showErrorSnackbar(
                    'Please select at least a country or mark the "Rest of the world" option',
                  );
                }

                const confirmedAreas = getConfirmedAreas(areas);

                if (everyWhere) {
                  const isOtherEverywhere = confirmedAreas.some(
                    (a) => a.everyWhere,
                  );

                  if (isOtherEverywhere) {
                    return showErrorSnackbar(
                      "Please remove the 'Rest of the world' option from another countries group",
                    );
                  }

                  // Remove the countryId because the user selected everyWhere
                  setValue(`${modalPath}.countryIds`, undefined);
                } else {
                  const hasRepeated = confirmedAreas.some(
                    (a) =>
                      a.countryIds?.some((ci) => countryIds?.includes(ci)) ||
                      a.countries?.some((c) => countryIds?.includes(c.id)),
                  );

                  if (hasRepeated) {
                    return showErrorSnackbar(
                      "You can't add the same country twice, try deleting the repeated one",
                    );
                  }
                }

                // set the confirmed so it will be shown on the table
                setValue(`${modalPath}.confirmed`, true);

                onClose();
              }}
            >
              Assign Countries
            </ContainedButton>
            <OutlinedButton size="large" fullWidth onClick={onClose}>
              Cancel
            </OutlinedButton>
          </div>
        </Box>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default AssignShippingCountriesModal;
