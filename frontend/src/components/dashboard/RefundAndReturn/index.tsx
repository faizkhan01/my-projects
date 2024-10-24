'use client';
import dynamic from 'next/dynamic';
import { USER_ROLES } from '@/constants/auth';
import routes from '@/constants/routes';
import { RefundWithExtraData } from '@/types/refunds';
import LightboxComponent from '@/ui-kit/LightBox';
import {
  BackLinkButton,
  ContainedButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import { ConditionalWrapper } from '@/ui-kit/containers';
import {
  DataGridColDef,
  DataGridRowActions,
  MobileDataTable,
  NewDataTable,
} from '@/ui-kit/tables';
import { MobileHeading } from '@/ui-kit/typography';
import { Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, X } from '@phosphor-icons/react';
import { cx } from 'cva';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import Image from 'next/image';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import { formatPrice } from '@/utils/currency';

const ConfirmRefundModal = dynamic(() => import('./ConfirmRefundModal'));
const RejectRefundModal = dynamic(() => import('./RejectRefundModal'));

interface RefundAndReturnProps {
  allRefunds: RefundWithExtraData[];
  role: USER_ROLES;
}

export const BoxStyle = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  backgroundColor: 'common.white',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  marginBottom: '96px',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    marginBottom: '60px',
  },
}));

const ProductImageContainer = styled('div')(() => ({
  height: '40px',
  width: '40px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '4px',
  cursor: 'pointer',
}));

const ImageCell = ({ refund }: { refund: RefundWithExtraData }) => {
  const [open, setOpen] = useState(false);

  const images = refund.images;
  const image = images?.[0];
  return (
    <div className="flex items-center gap-4 overflow-hidden">
      <div>
        {image ? (
          <ProductImageContainer onClick={() => setOpen(true)}>
            <Image
              src={image.url}
              alt={`${image.fileName}-image`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </ProductImageContainer>
        ) : (
          <Typography>Not provided</Typography>
        )}
      </div>
      <LightboxComponent
        open={open}
        close={() => setOpen(false)}
        slides={refund.images.map((i) => ({
          src: i.url,
          alt: i.fileName,
        }))}
      />
    </div>
  );
};

const getColumns = (
  role: USER_ROLES,
  onClickAction: (
    refund: RefundWithExtraData,
    action: 'CONFIRM' | 'REJECT',
  ) => void,
): {
  columns: DataGridColDef<RefundWithExtraData>[];
  mobileColumns: DataGridColDef<RefundWithExtraData>[];
} => {
  const getBackgroundColorForStatus = (
    status: RefundWithExtraData['status'],
  ) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning-main';
      case 'CANCELED':
        return 'bg-error-main';
      default:
        return 'bg-primary-main';
    }
  };

  const formatStatus = (status: RefundWithExtraData['status']) => {
    return upperFirst(status.toLowerCase());
  };

  const columnIdsToHide = {
    image: 'image',
    description: 'description',
    decisionReason: 'decisionReason',
    status: 'status',
    refundedAmount: 'refundedAmount',
    createdAt: 'createdAt',
  };

  const columns: DataGridColDef<RefundWithExtraData>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order Number',
      size: 130,
      meta: {
        mobileColSpan: 2,
        mobileHideLabel: true,
      },
      cell: (params) => {
        const status = params.row.original.status;
        return (
          <div className="flex items-center gap-3.5">
            <ConditionalWrapper
              condition={role === USER_ROLES.SELLER}
              wrapper={(children) => (
                <Link
                  component={NextLink}
                  href={routes.SELLER_DASHBOARD.ORDERS.INFO(
                    params.row.original.orderId,
                  )}
                  color="text.primary"
                >
                  {children}
                </Link>
              )}
            >
              <>#{params.row.original.orderNumber}</>
            </ConditionalWrapper>
            <div
              className={`${getBackgroundColorForStatus(
                status,
              )} flex h-5 items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white md:hidden`}
            >
              {formatStatus(status)}
            </div>
          </div>
        );
      },
    },
    {
      id: columnIdsToHide.image,
      accessorKey: 'image',
      header: 'Image',
      size: 120,
      cell: (params) => <ImageCell refund={params.row.original} />,
    },
    {
      accessorFn: (row) => row.reason?.name,
      header: 'Reason for refund',
      size: 150,
    },
    {
      id: columnIdsToHide.description,
      accessorKey: 'description',
      header: 'Description for refund',
      size: 150,
    },
    {
      id: columnIdsToHide.decisionReason,
      accessorKey: 'decisionReason',
      size: 150,
      header: 'Confirm/Reject Reason',
    },
    {
      id: columnIdsToHide.status,
      accessorKey: 'status',
      header: 'Status',
      size: 130,
      cell: (params) => {
        const status = params.row.original.status;
        return (
          <div className="flex items-center gap-1">
            <span
              className={cx(
                `inline-block h-1.5 w-1.5 rounded-full`,
                status === 'PENDING' && 'bg-warning-main',
                status === 'CANCELED' && 'bg-error-main',
                status !== 'PENDING' &&
                  status !== 'CANCELED' &&
                  'bg-primary-main',
              )}
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
              {upperFirst(status.toLowerCase())}
            </Typography>
          </div>
        );
      },
    },
    {
      id: columnIdsToHide.refundedAmount,
      accessorKey: 'amount',
      header: 'Refunded Amount',
      size: 100,
      cell: ({ getValue, row }) => {
        const value = getValue();

        return typeof value === 'number'
          ? formatPrice(value, {
              currency: row.original.currency,
            })
          : '';
      },
    },
    {
      accessorFn: (row) => row.orderItem?.totalPrice,
      header: 'Total Price',
      size: 100,
      cell: ({ getValue, row }) => {
        const value = getValue();

        return typeof value === 'number'
          ? formatPrice(value, {
              currency: row.original.currency,
            })
          : '';
      },
    },
    {
      id: columnIdsToHide.createdAt,
      accessorKey: 'createdAt',
      header: 'Date',
      size: 180,
      cell: ({ getValue }) =>
        dayjs(getValue() as RefundWithExtraData['createdAt']).format(
          'MMM D, YYYY h:mm a',
        ),
    },
  ];

  if (role === USER_ROLES.SELLER) {
    columns.push({
      header: 'Actions',
      size: 200,
      meta: {
        mobileHideLabel: true,
        mobileColSpan: 2,
      },
      cell: (params) => {
        return (
          <DataGridRowActions
            {...params}
            className="flex justify-between"
            actions={
              params.row.original.status === 'PENDING'
                ? [
                    <OutlinedButton
                      onClick={() =>
                        onClickAction(params.row.original, 'CONFIRM')
                      }
                      startIcon={
                        <Check size={14} className="text-success-main" />
                      }
                      className="h-8 min-h-0 !min-w-0 flex-1 rounded-[4px] border border-solid border-[#EAECF4] text-xs text-black hover:text-black"
                      key={'confirm'}
                    >
                      Confirm
                    </OutlinedButton>,
                    <OutlinedButton
                      onClick={() =>
                        onClickAction(params.row.original, 'REJECT')
                      }
                      startIcon={<X size={14} className="text-error-main" />}
                      key={'reject'}
                      className="h-8 min-h-0 !min-w-0 flex-1 rounded-[4px] border border-solid border-[#EAECF4] text-xs text-black hover:text-black"
                    >
                      Reject
                    </OutlinedButton>,
                  ]
                : []
            }
          />
        );
      },
    });
  }

  const mobileColumns = columns.filter((c) => {
    if (!c.id) return true;
    return Object.values(columnIdsToHide).includes(c.id) === false;
  });

  return { columns, mobileColumns };
};

const ReturnText = styled(Typography)(({ theme }) => ({
  fontWeight: '400',
  fontSize: '16px',
  marginBottom: '24px',

  [theme.breakpoints.down('sm')]: {
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '23px',
    marginBottom: '24px',
  },
}));

const DEFAULT_SELECTED_VALUES = {
  refund: null,
  action: null,
};

const Table = ({ allRefunds, role }: RefundAndReturnProps) => {
  const [selected, setSelected] = useState<{
    refund: RefundWithExtraData | null;
    action: 'CONFIRM' | 'REJECT' | null;
  }>(DEFAULT_SELECTED_VALUES);

  const getRowHeight = useCallback(() => 'auto', []);
  const tableTitle = 'All Refunds';

  return (
    <>
      {role === USER_ROLES.SELLER && (
        <>
          <ConfirmRefundModal
            refund={selected.refund}
            onClose={() => setSelected(DEFAULT_SELECTED_VALUES)}
            open={Boolean(selected.refund && selected.action === 'CONFIRM')}
          />
          <RejectRefundModal
            refund={selected.refund}
            onClose={() => setSelected(DEFAULT_SELECTED_VALUES)}
            open={Boolean(selected.refund && selected.action === 'REJECT')}
          />
        </>
      )}
      <NewDataTable
        getRowHeight={getRowHeight}
        enableRowSelection={false}
        title={tableTitle}
        data={allRefunds}
        hideOnMobile
        tableHeight={600}
        columns={
          getColumns(role, (refund, action) => {
            setSelected({ refund, action });
          }).columns
        }
      />
      <MobileDataTable
        title={tableTitle}
        data={allRefunds}
        columnNumber={2}
        columnsSpaceBetween={true}
        columns={
          getColumns(role, (refund, action) => {
            setSelected({ refund, action });
          }).mobileColumns
        }
      />
    </>
  );
};

const RefundAndReturn = ({ allRefunds, role }: RefundAndReturnProps) => {
  const getContent = () => {
    if (
      role === USER_ROLES.SELLER ||
      Boolean(allRefunds.length && role === USER_ROLES.USER)
    ) {
      return <Table allRefunds={allRefunds} role={role} />;
    } else if (role === USER_ROLES.USER && !allRefunds.length) {
      return (
        <>
          <Typography fontSize="24px" fontWeight="bold" sx={{ mb: '8px' }}>
            You don&apos;t have any returns yet.
          </Typography>
          <ReturnText>
            To make a return, go to My Orders, click on the order number and
            select Return Items.
          </ReturnText>
          <NextLink href={routes.DASHBOARD.MY_ORDERS} legacyBehavior passHref>
            <ContainedButton
              className="mb-[60px] h-12 w-[200px] md:mb-0"
              type="submit"
              size="large"
            >
              My orders
            </ContainedButton>
          </NextLink>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <BackLinkButton />
      <MobileHeading title="Refund and return" />
      <div>{getContent()}</div>
    </div>
  );
};

export default RefundAndReturn;
