import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { Box, Rating, Tooltip, Typography, Stack } from '@mui/material';
import {
  BackLinkButton,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { Pencil, Plus, Star, Trash } from '@phosphor-icons/react';
import { SellerProduct } from '@/types/products';
import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import routes from '@/constants/routes';
import useCategories from '@/hooks/queries/useCategories';
import { Category } from '@/types/categories';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/services/API/products';
import { handleAxiosError } from '@/lib/axios';
import DeleteProductDialog from './DeleteProductDialog';
import { ConditionalWrapper } from '@/ui-kit/containers';
import { MobileDataTable } from '@/ui-kit/tables';
import {
  DataGridRowActions,
  NewDataTable,
  type DataGridColDef,
} from '@/ui-kit/tables';
import { CellContext } from '@tanstack/react-table';
import { calculatePrice, formatPrice } from '@/utils/currency';
import RefundPolicyModal from '../modals/RefundPolicyModal';

interface SellerProductsProps {
  sellerProducts: SellerProduct[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'common.white',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  marginBottom: '96px',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '60px',
  },
}));

const ProductImageContainer = styled(Box)(() => ({
  height: '40px',
  width: '40px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '4px',
  display: 'block',
}));

const tableTitle = 'All Products';

const CatalogAllProduct = ({ sellerProducts }: SellerProductsProps) => {
  const { categories = [] } = useCategories();
  const [products, setProducts] = useState(sellerProducts);
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showRefundPolicyModal, setShowRefundPolicyModal] = useState(false);
  // const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Function to handle checkbox selection
  // const handleProductSelection = (selectedIds: string[]) => {
  //   setSelectedProductIds(selectedIds);
  // };

  // Function to open the refund policy modal
  const openRefundPolicyModal = () => {
    setShowRefundPolicyModal(true);
  };

  // Function to close the refund policy modal
  const closeRefundPolicyModal = () => {
    setShowRefundPolicyModal(false);
  };

  // Function to apply the selected refund policy to selected products
  // const applyRefundPolicy = (refundPolicy: string) => {
  //   // Handle applying the refund policy to selected products (update API or state)
  //   // console.log('Applying refund policy:', refundPolicy);
  //   refundPolicy;
  //   // Close the modal
  //   closeRefundPolicyModal();
  // };

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    setIsLoading(true);

    try {
      await deleteProduct(deleting);
      setDeleting(null);
      setProducts((products) => products.filter((p) => p.id !== deleting));
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }, [deleting]);

  const { columns, mobileColumns } = useMemo(() => {
    const getRowActions = (params: CellContext<SellerProduct, unknown>) => {
      return (
        <DataGridRowActions
          {...params}
          actions={[
            <DataGridRowActions.Action
              label="Edit"
              icon={<Pencil />}
              key="edit"
              showInMenu
              onClick={() =>
                push(
                  routes.SELLER_DASHBOARD.PRODUCTS.UPDATE(
                    params.row.original.id,
                  ),
                )
              }
            />,
            <DataGridRowActions.Action
              label="Delete"
              key="delete"
              icon={<Trash size={18} />}
              showInMenu
              onClick={() => setDeleting(params.row.original.id)}
            />,
          ]}
        />
      );
    };
    const result: DataGridColDef<SellerProduct>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
        meta: {
          mobileColSpan: 3,
          mobileHideLabel: true,
        },
        cell: (params) => {
          const image = params.row.original.images?.[0];
          return (
            <div className="flex w-full items-center justify-between gap-1">
              <div className="flex items-center gap-2 md:gap-4">
                {image?.url && (
                  <ConditionalWrapper
                    condition={params.row.original.published}
                    wrapper={(c) => (
                      <Link
                        href={routes.PRODUCTS.INFO(
                          params.row.original.slug,
                          params.row.original.id,
                        )}
                      >
                        {c}
                      </Link>
                    )}
                  >
                    <ProductImageContainer>
                      <Image
                        src={image?.url}
                        alt={`${image.fileName}-image`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </ProductImageContainer>
                  </ConditionalWrapper>
                )}
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '18px',
                    }}
                  >
                    {params.row.original.name}
                  </Typography>
                </Box>
              </div>
              <div className="md:hidden">{getRowActions(params)}</div>
            </div>
          );
        },
      },
      // {
      //   accessorKey: 'availability',
      //   header: 'Availability',
      //   size: 150,
      //   cell: (params) => {
      //     let text: string;
      //
      //     if (params.row.original.shippingProfile?.areas) {
      //       const hasEverywhere =
      //         params.row.original.shippingProfile?.areas.some(
      //           (a) => a.everyWhere,
      //         );
      //
      //       const allCountries: Country[] = [];
      //
      //       for (const area of params.row.original.shippingProfile.areas) {
      //         if (area.countries?.length && !area.everyWhere) {
      //           allCountries.push(...area.countries);
      //         }
      //       }
      //
      //       text = `${
      //         hasEverywhere ? countries?.length : allCountries.length
      //       }/${countries.length} channels`;
      //     } else {
      //       text = 'Unavailable';
      //     }
      //
      //     return (
      //       <Tooltip
      //         title={
      //           params.row.original.shippingProfile
      //             ? `Shipping profile: ${params.row.original.shippingProfile?.name}`
      //             : 'No shipping profile'
      //         }
      //       >
      //         <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      //           <Box
      //             component="span"
      //             title={text}
      //             sx={{
      //               display: 'inline-block',
      //               width: 6,
      //               height: 6,
      //               borderRadius: '50%',
      //               backgroundColor: params.row.original.shippingProfile
      //                 ? 'primary.main'
      //                 : 'error.main',
      //             }}
      //           />
      //           <Typography
      //             component="span"
      //             style={{
      //               fontStyle: 'normal',
      //               fontWeight: 400,
      //               fontSize: '14px',
      //               lineHeight: '18px',
      //             }}
      //           >
      //             {text}
      //           </Typography>
      //         </Box>
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        header: 'Type',
        accessorFn: (row) => row.category?.name,
        size: 150,
        cell: (params) => {
          const parents: Category[] = [];
          let lastCategory: null | Category =
            params.row.original.category ?? null;

          while (lastCategory) {
            parents.unshift(lastCategory);

            if (lastCategory.parentId === null) break;

            lastCategory =
              categories.find(
                (category) => category.id === lastCategory?.parentId,
              ) ?? null;
          }

          return (
            <Tooltip
              title={
                parents.length > 0
                  ? parents.map((p) => p.name).join(' > ')
                  : undefined
              }
            >
              <Box
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
                component="span"
              >
                {params.row.original.category?.name ?? 'No Category'}
              </Box>
            </Tooltip>
          );
        },
      },
      {
        header: 'SKU',
        accessorKey: 'sku',
        size: 150,
        cell: ({ getValue }) => getValue() || 'Not Provided',
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        size: 170,
        cell: (params) => (
          <Tooltip
            title={
              params.row.original.totalReviews
                ? `Calculated from ${params.row.original.totalReviews} reviews`
                : 'No reviews yet'
            }
          >
            <Box>
              <Rating
                value={params.row.original.rating}
                readOnly
                emptyIcon={<Star size={24} />}
                icon={<Star size={24} weight="fill" />}
              />
            </Box>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        cell: (params) => {
          const calculatedPrice = calculatePrice({
            price: params.row.original.price,
            discount: params.row.original.discount,
          });
          const currency = params.row.original.currency;

          return (
            <Tooltip
              title={`Calculated from ${formatPrice(params.row.original.price, {
                currency,
                locale: false,
              })} - ${params.row.original.discount}% (discount)`}
            >
              <Box
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
                component="span"
              >
                {formatPrice(calculatedPrice.total, {
                  currency,
                  locale: false,
                })}
              </Box>
            </Tooltip>
          );
        },
      },

      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 100,
        cell: (params) => {
          const value = params.getValue();
          if (value === 0) return 'Out of stock';
          return value;
        },
      },
      {
        accessorKey: 'published',
        header: 'Published',
        cell: (params) => {
          const value = params.getValue();
          const text = value ? 'Published' : 'Unpublished';

          return (
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Box
                component="span"
                title={text}
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: value ? 'primary.main' : 'error.main',
                }}
              />
              <Typography
                component="span"
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {text}
              </Typography>
            </Box>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (params) => getRowActions(params),
      },
    ];

    return {
      columns: result,
      mobileColumns: result.filter((c) => c.id !== 'actions'),
    };
  }, [categories, push]);

  return (
    <Box>
      <RefundPolicyModal
        open={showRefundPolicyModal}
        onClose={closeRefundPolicyModal}
        // onSelect={applyRefundPolicy}
      />
      <DeleteProductDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        isLoading={isLoading}
        confirmDelete={() => confirmDelete()}
      />
      <BackLinkButton />
      <MobileHeading title="Catalog" />
      <Stack spacing="24px">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: '22px',
          }}
        >
          <Typography
            component="h4"
            sx={{
              fontSize: { xs: '18px', md: '24px' },
              fontWeight: 600,
              lineHeight: { xs: '21.6px', md: '32px' },
            }}
          >
            Products
          </Typography>
          <Box className="sm:block md:flex">
            <Box className="mb-[12px] w-[250px] md:mb-0">
              <OutlinedButton
                onClick={openRefundPolicyModal}
                // disabled={selectedProductIds.length === 0} // Disable if no products are selected
              >
                Change Refund Policies
              </OutlinedButton>
            </Box>
            <Link
              passHref
              legacyBehavior
              href={routes.SELLER_DASHBOARD.PRODUCTS.NEW}
            >
              <ContainedButton
                endIcon={<Plus size={18} />}
                className="w-[146px] min-w-0"
              >
                Create New
              </ContainedButton>
            </Link>
          </Box>
        </Box>
        <StyledBox>
          <NewDataTable
            title={tableTitle}
            data={products}
            enableRowSelection={true}
            checkboxSelection={true}
            columns={columns}
            hideOnMobile
            tableHeight={600}
          />
          <MobileDataTable
            title={tableTitle}
            data={products}
            columnsSpaceBetween={true}
            columns={mobileColumns}
            columnNumber={3}
          />
        </StyledBox>
      </Stack>
    </Box>
  );
};

export default CatalogAllProduct;
