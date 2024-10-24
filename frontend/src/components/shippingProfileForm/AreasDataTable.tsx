import useCountries from '@/hooks/queries/useCountries';
import {
  ShippingProfileAreaWithoutId,
  ShippingProfileFormValues,
} from '@/types/shippingProfiles';
import {
  DataGridColDef,
  DataGridRowActions,
  MobileDataTable,
  NewDataTable,
} from '@/ui-kit/tables';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trash } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { getTableConfirmedAreas } from './utils';
import { styled } from '@mui/material/styles';
import { useSellerCurrency } from '@/hooks/queries/useProfile';
import { formatPrice } from '@/utils/currency';

type Area = ShippingProfileAreaWithoutId;
type FormValues = ShippingProfileFormValues;

const CountryImageContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '20px',
  width: '20px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '50%',
}));

const AreasDataTable = ({
  prefix = '',
  setValue,
  areas,
}: {
  prefix?: string; // There might be a better way to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  areas: FormValues['areas'];
}) => {
  const { countries } = useCountries();
  const currency = useSellerCurrency();

  const tableConfirmedAreas: Area[] = getTableConfirmedAreas(
    areas,
    countries ?? [],
  );

  const handleTrashArea = useCallback(
    (area: Area) => {
      if (area.everyWhere) {
        setValue(`${prefix}areas`, [
          ...areas.filter(
            (a) => a.everyWhere === false || a.confirmed === false,
          ),
        ]);
        return;
      }

      setValue(`${prefix}areas`, [
        ...areas.filter((a) => {
          if (a.countryIds && area.countryIds) {
            return a.countryIds.every((ci) => !area.countryIds?.includes(ci));
          }

          if (a.countries && area.countries) {
            return a.countries.every(
              (c) => !area.countries?.some((ac) => ac.id === c.id),
            );
          }

          return true;
        }),
      ]);
    },
    [areas, prefix, setValue],
  );

  const areasColumns: DataGridColDef<Area>[] = useMemo(() => {
    const columns: DataGridColDef<Area>[] = [
      {
        accessorKey: 'to',
        header: 'To',
        size: 300,
        meta: {
          mobileColSpan: 2,
          mobileHideLabel: true,
        },

        cell: ({ row }) => {
          const countriesData:
            | {
                emoji: string;
                id?: number;
                name?: string;
                everyWhere?: boolean;
              }[]
            | undefined = row.original.everyWhere
            ? [{ emoji: '🌎', everyWhere: true }]
            : row.original.countries?.map((c) => ({
                id: c.id,
                name: c.name,
                emoji: c.emoji,
              }));

          return (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {countriesData?.map((data, index) => {
                const image = data.emoji;

                return (
                  <div
                    className="flex items-center"
                    key={`${data.id}-${data.name}-${data.everyWhere}-${index}`}
                  >
                    <CountryImageContainer>
                      <Box role="img" component="span">
                        {image}
                      </Box>
                    </CountryImageContainer>

                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '18px',
                      }}
                      component="span"
                    >
                      {data.everyWhere
                        ? 'Everywhere else'
                        : data.name ?? 'Without name'}
                      {index < countriesData.length - 1 ? ', ' : ''}
                    </Typography>
                  </div>
                );
              })}
            </Box>
          );
        },
      },
      {
        accessorKey: 'carrier',
        header: 'Carrier',
        size: 150,
      },
      {
        size: 200,
        header: 'Cost',
        accessorFn: (row) => {
          const price = Number(row.price);
          return price > 0 ? price : 'Free';
        },
        cell: ({ getValue }) => {
          const value = getValue();

          if (typeof value === 'number') {
            return formatPrice(value, {
              currency,
            });
          }

          return value;
        },
      },
      {
        id: 'days',
        header: 'Delivery Time',
        accessorFn: (params) => {
          const min = params.minDays;
          const max = params.maxDays;
          return min === max
            ? `${min} ${min === 1 ? 'day' : 'days'}`
            : `${min}-${max} days`;
        },
      },
      {
        header: 'Actions',
        size: 120,
        meta: {
          headerAlign: 'center',
          align: 'center',
        },
        cell: (params) => {
          return (
            <DataGridRowActions
              actions={[
                <DataGridRowActions.Action
                  onClick={() => {
                    handleTrashArea(params.row.original);
                  }}
                  icon={<Trash size={18} />}
                  label="trash"
                  key="trash"
                />,
              ]}
              {...params}
            />
          );
        },
      },
    ];

    return columns.map((c) => ({ ...c, sortable: false }));
  }, [handleTrashArea, currency]);

  return (
    <>
      <NewDataTable
        columns={areasColumns}
        hideOnMobile
        data={tableConfirmedAreas}
        hideToolbar
        hideFooter
        enableRowSelection={false}
      />
      <MobileDataTable
        columns={areasColumns}
        data={tableConfirmedAreas}
        hideToolbar
        columnNumber={2}
        hideFooter
        enableRowSelection={false}
      />
    </>
  );
};

export default AreasDataTable;
