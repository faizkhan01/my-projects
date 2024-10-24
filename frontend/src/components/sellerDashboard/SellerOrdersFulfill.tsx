import routes from '@/constants/routes';
import { Box, Typography, Divider, Grid, TypographyProps } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import {
  BackLinkButton,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import { FormInput } from '@/ui-kit/inputs';
import { DataTable } from '@/ui-kit/tables';
import { MobileHeading } from '@/ui-kit/typography';
import { ClientOrder } from '@/types/orders';
import { OrderItemStatus } from '@/types/orders';
import { ControlledAutocomplete } from '../hookForm/ControlledAutocomplete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { upperFirst } from 'lodash';
import { useMemo } from 'react';
import { handleAxiosError } from '@/lib/axios';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { fulfillOrder } from '@/services/API/orders';
import { useSellerCurrency } from '@/hooks/queries/useProfile';
import { createCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { formatPrice } from '@/utils/currency';

const StyledBox = styled(Box)(() => ({
  backgroundColor: 'common.white',
  marginBottom: '30px',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  padding: '24px',
  borderRadius: '10px',
}));

const BoxForDivider = styled(Box)(() => ({
  backgroundColor: 'common.white',
  marginBottom: '30px',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
}));

const UpPaddingBox = styled(Box)(() => ({
  padding: '24px 24px 0px 24px',
}));

const DownPaddingBox = styled(Box)(() => ({
  padding: '0px 24px 24px 24px',
}));

const MainHeading = styled((props: TypographyProps<'h3'>) => (
  <Typography component="h3" {...props} />
))<TypographyProps<'h3'>>(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '24px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const BoxHeading = styled((props: TypographyProps<'h4'>) => (
  <Typography component="h4" {...props} />
))<TypographyProps<'h4'>>(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  marginBottom: '16px',
  color: theme.palette.text.primary,
}));

interface SellerOrdersFulfillProps {
  clientOrder: ClientOrder;
}

interface FormValues {
  carrierName: string;
  trackNumber: string;
  orderItems: number[];
}

const schema = yup.object({
  carrierName: yup.string().required('Please enter a carrier name'),
  trackNumber: yup.string().required('Please enter a tracking number'),
  orderItems: yup
    .array()
    .of(yup.number())
    .min(1, 'Please select items to fulfill')
    .required('Please select items to fulfill'),
});

const SellerOrdersFulfill = ({ clientOrder }: SellerOrdersFulfillProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      orderItems: [],
      carrierName: '',
      trackNumber: '',
    },
  });
  const converter = useMemo(
    () => createCurrencyConverter(clientOrder.rates ?? {}),
    [clientOrder.rates],
  );
  const sellerCurrency = useSellerCurrency();
  const { push } = useRouter();
  const params = useParams();

  const orderItems = watch('orderItems');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await fulfillOrder(clientOrder.id, data);
      showSuccessSnackbar(res.message);
      push(routes.SELLER_DASHBOARD.ORDERS.LIST);
    } catch (e) {
      handleAxiosError(e);
    }
  };

  const { columns } = useMemo(() => {
    const columns: GridColDef<ClientOrder['items'][0]>[] = [
      {
        field: 'name',
        headerName: 'Product',
        width: 350,
        renderCell: (params) => {
          const image = params.row?.product.images?.[0];
          return (
            <div className="flex items-center gap-4">
              {image?.url && (
                <div>
                  <Image
                    src={image.url}
                    alt={`${params.row.product.name}-image`}
                    width={40}
                    height={40}
                  />
                </div>
              )}
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {params.row.product?.name ?? ''}
              </Typography>
            </div>
          );
        },
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        headerAlign: 'left',
        align: 'left',
        type: 'number',
        width: 155,
      },
      {
        field: 'totalPrice',
        headerName: 'Total Price',
        headerAlign: 'left',
        align: 'left',
        type: 'number',
        width: 155,
        valueGetter: (params) => {
          return converter(params.value, {
            from: clientOrder.paymentCurrency,
            to: sellerCurrency,
          });
        },
        valueFormatter: (params) => {
          return formatPrice(params.value, {
            currency: sellerCurrency,
          });
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        valueFormatter: (params) =>
          upperFirst(params.value.toLowerCase().split('_').join(' ')),
      },
    ];
    return { columns };
  }, [clientOrder.paymentCurrency, converter, sellerCurrency]);

  const itemsReadyToFulfill = useMemo(
    () => clientOrder.items.filter((i) => i.status === OrderItemStatus.CREATED),
    [clientOrder.items],
  );

  return (
    <>
      <BackLinkButton />
      <MobileHeading title="Orders" />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: {
            xs: '24px',
            sm: '30px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <MainHeading>Order #{params.id} - Add Fulfillment </MainHeading>
        </Box>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <BoxForDivider>
          <UpPaddingBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <BoxHeading>Items ready to ship</BoxHeading>
            {errors.orderItems?.message && (
              <Typography color="error" component="span">
                {errors.orderItems.message}
              </Typography>
            )}
          </UpPaddingBox>
          <DataTable
            columns={columns}
            rows={itemsReadyToFulfill}
            checkboxSelection={true}
            rowSelectionModel={orderItems}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setValue(
                'orderItems',
                newRowSelectionModel.map((i) => Number(i)),
                {
                  shouldDirty: true,
                },
              );
            }}
            hideToolbar
            hideFooter
            autoHeight
          />
          <Divider sx={{ marginBottom: '24px' }} />
          <DownPaddingBox>
            <BoxHeading>Basic Information</BoxHeading>

            <Grid
              container
              direction={{
                xs: 'column',
                lg: 'row',
              }}
              spacing="16px"
              sx={{ marginBottom: '16px' }}
            >
              <Grid item xs={12} sm={6}>
                <ControlledAutocomplete
                  name={`carrierName`}
                  control={control}
                  options={['UPS', 'FedEx', 'Canada Post', 'DHL']}
                  freeSolo
                  label="Choose a carrier"
                  autoHighlight
                  placeholder="Choose a carrier"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  id="track"
                  name="trackNumber"
                  control={control}
                  label="Track number"
                  placeholder="1 4 2 1 1 7 1 6 0 0 7 3 8 9"
                />
              </Grid>
            </Grid>
            <FormInput
              sx={{ borderColor: '#EAECF4' }}
              id="note"
              label="Note"
              type="text"
              rows={4}
              multiline={true}
              placeholder="Write a padlock"
            />
            {/* <Box */}
            {/*   sx={{ */}
            {/*     margin: '10px 0px 10px 0px', */}
            {/*     '& .MuiTypography-root': { */}
            {/*       fontWeight: '400', */}
            {/*       fontSize: '14px', */}
            {/*       LineHeight: '18px', */}
            {/*     }, */}
            {/*   }} */}
            {/* > */}
            {/*   <ControlledFormCheckbox */}
            {/*     control={control} */}
            {/*     name="" */}
            {/*     label="Send shipment details to customer" */}
            {/*   /> */}
            {/* </Box> */}

            <ContainedButton
              className="mt-6 w-full max-w-full md:max-w-[130px]"
              loading={isSubmitting}
              type="submit"
            >
              Fulfill
            </ContainedButton>
          </DownPaddingBox>
        </BoxForDivider>
        <StyledBox>
          <div className="flex flex-wrap items-center justify-end gap-5">
            <Link
              href={routes.SELLER_DASHBOARD.ORDERS.INFO(Number(params.id))}
              legacyBehavior
              passHref
            >
              <OutlinedButton
                size="large"
                className="w-full max-w-full md:max-w-[120px]"
                type="submit"
              >
                Back
              </OutlinedButton>
            </Link>
          </div>
        </StyledBox>
      </form>
    </>
  );
};

export default SellerOrdersFulfill;
