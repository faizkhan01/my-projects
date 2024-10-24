import { BoxStyle } from './OrdersPage';
import { Box, Typography, Button, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';
import routes from '@/constants/routes';
import {
  DataGridColDef,
  DataGridRowActions,
  MobileDataTable,
  NewDataTable,
} from '@/ui-kit/tables';
import {
  BackLinkButton,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { ShippingProfile } from '@/types/shippingProfiles';
import { Pencil, Trash } from '@phosphor-icons/react';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { useCallback, useMemo, useState } from 'react';
import { handleAxiosError } from '@/lib/axios';
import { deleteShippingProfile } from '@/services/API/shipping-profiles';
import { mutate } from 'swr';
import { useShippingProfiles } from '@/hooks/queries/useShippingProfiles';
import { SELLER } from '@/constants/api';
import { useRouter } from 'next/navigation';
import { Country } from '@/types/countries';

const topStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: 'none',
  alignItems: 'center',
  padding: '0px 20px 0px 20px',
  height: '56px',
};
const typoStyle1 = {
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '24px',
};
const typoStyle2 = {
  fontWeight: 400,
  fontSize: { xs: '14px', sm: '18px' },
  lineHeight: '24px',
  color: 'primary.main',
};

const ShippingProfiles = () => {
  const [deleting, setDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { shippingProfiles = [] } = useShippingProfiles();

  const { push } = useRouter();

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    setIsLoading(true);

    try {
      await deleteShippingProfile(deleting);
      mutate(SELLER.SHIPPING_PROFILES.LIST);
      setDeleting(null);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }, [deleting]);

  const columns = useMemo(() => {
    const result: DataGridColDef<ShippingProfile>[] = [
      { accessorKey: 'id', id: 'id' },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorFn: (row) => row.fromCountry?.name,
        header: 'Shipping from',
        meta: {
          headerAlign: 'center',
          align: 'center',
          description: 'Country where the items are shipped from',
        },
        size: 150,
        cell: (params) => {
          const image = params.row.original.fromCountry?.emoji;

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              title={params.row.original.fromCountry.name ?? 'Unknown'}
            >
              {image && (
                <Box role="img" component="span">
                  {image}
                </Box>
              )}
            </Box>
          );
        },
      },
      {
        accessorFn: (row) =>
          `${row.minProcessingDays} - ${row.maxProcessingDays} days`,
        header: 'Processing Days',
        meta: {
          headerAlign: 'center',
          align: 'center',
          description: 'Time to process the items before shipping',
        },
        size: 150,
      },
      {
        size: 150,
        accessorFn: (row) => row.areas.filter((a) => !a.everyWhere),
        header: 'Areas',
        meta: {
          headerAlign: 'center',
          align: 'center',
          description: 'Areas/countries that have custom settings',
        },
        enableSorting: false,
        cell: (params) => {
          const allCountries: Country[] = [];

          for (const area of params.row.original.areas) {
            if (area.countries?.length && !area.everyWhere) {
              allCountries.push(...area.countries);
            }
          }

          return (
            <Box sx={{ display: 'flex', columnGap: 0.5, flexWrap: 'wrap' }}>
              {allCountries.map(
                (country) =>
                  country?.emoji && (
                    <Tooltip
                      title={country.name}
                      key={`${country.name} - ${country.emoji}`}
                    >
                      <Box role="img" component="span">
                        {country.emoji}
                      </Box>
                    </Tooltip>
                  ),
              )}
            </Box>
          );
        },
      },
      {
        header: 'Shipping Everywhere',
        meta: {
          description:
            'Indicates if it can send orders to all the available countries around the world',
        },
        accessorFn: (row) => row.areas.some((a) => a.everyWhere),
        cell: (params) => {
          const value = params.getValue() as boolean;
          const text = (value as boolean) ? 'Yes' : 'No';

          return (
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
              title={text}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: value ? 'primary.main' : 'warning.main',
                }}
              />
              <span
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {text}
              </span>
            </Box>
          );
        },
      },
      {
        header: 'Actions',
        size: 200,
        enableSorting: false,
        cell: (params) => {
          return (
            <DataGridRowActions
              {...params}
              actions={[
                <DataGridRowActions.Action
                  label="Edit"
                  key="edit"
                  icon={<Pencil size={18} />}
                  onClick={() =>
                    push(
                      routes.SELLER_DASHBOARD.SHIPPING.METHODS.UPDATE(
                        params.row.original.id,
                      ),
                    )
                  }
                />,
                <DataGridRowActions.Action
                  label="Delete"
                  key="delete"
                  icon={<Trash size={18} />}
                  onClick={() => setDeleting(params.row.original.id)}
                />,
              ]}
            />
          );
        },
      },
    ];
    return result;
  }, [push]);

  return (
    <>
      <BackLinkButton />
      <MobileHeading title="Shipping Methods" />
      <ModalContainer
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
      >
        <ModalCardContainer
          title="Are you sure you want to delete this shipping profile?"
          titleSx={{
            fontSize: '18px',
            textAlign: 'left',
          }}
          minHeight="auto"
        >
          <Stack spacing={3} sx={{ pt: 3, height: '100%' }}>
            <Typography>
              Deleting this shipping profile will remove it from all your <br />
              products
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                rowGap: 1,
                columnGap: 2,
                mt: 'auto',
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <ContainedButton
                fullWidth
                color="error"
                onClick={confirmDelete}
                loading={isLoading}
              >
                Confirm
              </ContainedButton>
              <OutlinedButton onClick={() => setDeleting(null)} fullWidth>
                Cancel
              </OutlinedButton>
            </Box>
          </Stack>
        </ModalCardContainer>
      </ModalContainer>
      <BoxStyle>
        <Box sx={topStyle}>
          <Typography sx={typoStyle1} component="h4">
            Shipping Profiles
          </Typography>
          <Button
            sx={typoStyle2}
            component={Link}
            href={routes.SELLER_DASHBOARD.SHIPPING.METHODS.NEW}
          >
            Create Shipping Profile
          </Button>
        </Box>
        <NewDataTable
          hideToolbar
          columns={columns}
          data={shippingProfiles}
          checkboxSelection={false}
          hideOnMobile
          getRowHeight={() => 60}
          tableHeight={600}
          initialState={{
            sorting: [
              {
                id: 'id',
                desc: true,
              },
            ],
            columnVisibility: {
              id: false,
            },
          }}
        />
        <MobileDataTable
          hideToolbar
          columnNumber={2}
          data={shippingProfiles}
          columns={columns}
          initialState={{
            sorting: [
              {
                id: 'id',
                desc: true,
              },
            ],
            columnVisibility: {
              id: false,
            },
          }}
        />
      </BoxStyle>
    </>
  );
};

export default ShippingProfiles;
