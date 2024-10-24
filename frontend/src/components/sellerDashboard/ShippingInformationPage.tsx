import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BottomPageActions } from '../dashboard/BottomPageActions';
import routes from '@/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileHeading } from '@/ui-kit/typography';
import { BackLinkButton } from '@/ui-kit/buttons';
import { useCallback, useState } from 'react';
import useCountries from '@/hooks/queries/useCountries';
import { ProfileData } from '@/types/user';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from '@/hooks/stores/useGlobalSnackbar';
import {
  ShippingProfile,
  ShippingProfileFormValues,
} from '@/types/shippingProfiles';
import axios from 'axios';
import {
  createShippingProfile,
  updateShippingProfile,
} from '@/services/API/shipping-profiles';
import { getRedirectTo } from '@/utils/redirects';
import { useSWRConfig } from 'swr';
import { SELLER } from '@/constants/api';
import { shippingProfileFormSchema } from '@/utils/yupValidations';
import {
  getTableConfirmedAreas,
  handleUpdateAreas,
} from '../shippingProfileForm/utils';
import AreasDataTable from '../shippingProfileForm/AreasDataTable';
import ProcessingTimeSelector from '../shippingProfileForm/ProcessingTimeSelector';
import ShippingOriginSelector from '../shippingProfileForm/ShippingOriginSelector';
import AssignShippingCountriesModal from '../shippingProfileForm/AssignShippingCountriesModal';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  marginBottom: '30px',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  padding: '24px',
  borderRadius: '10px',
}));

const BoxForDivider = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  marginBottom: '30px',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
}));

const PaddingBox = styled(Box)(() => ({
  padding: '24px',
}));

const BoxHeading = styled('h3')(({ theme }) => ({
  fontStyle: 'normal',
  margin: 0,
  fontWeight: '600',
  fontSize: '18px',
  color: theme.palette.text.primary,
}));

const AssignButton = styled(Button)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  color: theme.palette.primary.main,
}));

const DownMarginBox = styled(Box)(({ theme }) => ({
  marginBottom: '96px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '60px',
  },
}));

type FormValues = ShippingProfileFormValues;

const formDefaultValues: FormValues = {
  minProcessingDays: -1,
  maxProcessingDays: -1,
  countryId: -1,
  name: '',
  description: '',
  areas: [
    {
      carrier: '',
      price: 0,
      minDays: 0,
      maxDays: 0,
      everyWhere: false,
      confirmed: false,
    },
  ],
};

const schema = shippingProfileFormSchema();

interface ShippingInformationPageProps {
  profile: ProfileData;
  shippingProfile?: ShippingProfile;
  isEdit?: boolean;
}

const ShippingInformationPage = ({
  profile,
  shippingProfile,
  isEdit = false,
}: ShippingInformationPageProps) => {
  const {
    control,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { defaultValues, isSubmitted, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: shippingProfile?.name ?? formDefaultValues.name,
      description:
        shippingProfile?.description ?? formDefaultValues.description,
      minProcessingDays:
        shippingProfile?.minProcessingDays ??
        formDefaultValues.minProcessingDays,
      areas: shippingProfile?.areas ?? formDefaultValues.areas,
      maxProcessingDays:
        shippingProfile?.maxProcessingDays ??
        formDefaultValues.maxProcessingDays,
      countryId:
        shippingProfile?.fromCountry.id ??
        profile?.store?.country?.id ??
        formDefaultValues.countryId,
    },
    resolver: yupResolver(schema),
  });

  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const { countries } = useCountries();

  const [from, to, areas] = watch([
    'minProcessingDays',
    'maxProcessingDays',
    'areas',
  ]);

  const { mutate } = useSWRConfig();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (isEdit) {
        if (!shippingProfile) {
          return console.error('Shipping Profile is undefined');
        }

        await updateShippingProfile(shippingProfile.id, {
          name: data.name,
          countryId: data.countryId,
          description: data.description,
          minProcessingDays: data.minProcessingDays,
          maxProcessingDays: data.maxProcessingDays,
        });

        await handleUpdateAreas(
          shippingProfile.id,
          data.areas,
          shippingProfile.areas,
        );

        showSuccessSnackbar('Shipping profile updated successfully');
        await mutate(SELLER.SHIPPING_PROFILES.LIST);
        push(
          getRedirectTo(searchParams) ??
            routes.SELLER_DASHBOARD.SHIPPING.METHODS.INDEX,
        );
        return;
      }

      await createShippingProfile({
        name: data.name,
        areas: data.areas.map((a) => {
          if (a.countryIds?.length && a.everyWhere) {
            a.countryIds = undefined;
          }

          return a;
        }),
        countryId: data.countryId,
        maxProcessingDays: data.maxProcessingDays,
        minProcessingDays: data.minProcessingDays,
        description: data.description,
      });
      showSuccessSnackbar('Shipping profile created successfully');
      await mutate(SELLER.SHIPPING_PROFILES.LIST);
      push(
        getRedirectTo(searchParams) ??
          routes.SELLER_DASHBOARD.SHIPPING.METHODS.INDEX,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return showErrorSnackbar(error.message);
      }

      console.error(error);
    }
  };

  const onClose = useCallback(() => {
    // Clean form when close if it's not confirmed
    if (areas?.[areas.length - 1]?.confirmed === false) {
      setValue(`areas`, areas.slice(0, -1));
    }
    setOpen(false);
  }, [areas, setValue]);

  const onOpen = useCallback(() => {
    const lastArea = areas[areas.length - 1];
    if (lastArea?.confirmed === true || lastArea?.id) {
      setValue(`areas.${areas.length}`, formDefaultValues.areas[0]);
    } else if (!areas.length) {
      setValue(`areas.${areas.length}`, formDefaultValues.areas[0]);
    }

    setOpen(true);
  }, [areas, setValue]);

  const tableConfirmedAreas = getTableConfirmedAreas(areas, countries ?? []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackLinkButton />
      <MobileHeading title="Create shipping zone" />
      <AssignShippingCountriesModal
        open={open}
        areas={areas}
        onClose={onClose}
        methods={{
          control,
          setValue,
          getValues,
          trigger,
          watch,
        }}
      />
      <DownMarginBox>
        <StyledBox>
          <BoxHeading sx={{ mb: 2 }}>General Information</BoxHeading>
          <Stack spacing="16px">
            <ControlledFormInput
              id="Shipping-zone-name"
              label="Title"
              name="name"
              placeholder="Enter the title"
              control={control}
            />
            <ControlledFormInput
              id="description"
              label="Description (optional)"
              type="text"
              name="description"
              rows={3}
              multiline
              placeholder="Description"
              control={control}
            />
            <ProcessingTimeSelector
              defaultMinDays={defaultValues?.minProcessingDays}
              minDays={from}
              maxDays={to}
              control={control}
              setValue={setValue}
            />
            <ShippingOriginSelector control={control} />
          </Stack>
        </StyledBox>
        <BoxForDivider>
          <PaddingBox
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <BoxHeading>Countries</BoxHeading>
              <AssignButton onClick={onOpen}>Assign countries</AssignButton>
            </Box>

            {!tableConfirmedAreas.length && (
              <Typography
                fontSize="14px"
                textAlign="center"
                color={
                  isSubmitted && !tableConfirmedAreas.length
                    ? 'error.main'
                    : 'text.secondary'
                }
              >
                Add a country to start shipping
              </Typography>
            )}
          </PaddingBox>
          {!!tableConfirmedAreas.length && (
            <AreasDataTable setValue={setValue} areas={areas} />
          )}
        </BoxForDivider>
      </DownMarginBox>

      <BottomPageActions
        backHref={routes.SELLER_DASHBOARD.SHIPPING.METHODS.INDEX}
        loading={isSubmitting}
      />
    </form>
  );
};

export default ShippingInformationPage;
