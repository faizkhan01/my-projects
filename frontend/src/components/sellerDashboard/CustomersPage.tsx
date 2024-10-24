import {
  DataGridRowActions,
  NewDataTable,
  type DataGridColDef,
} from '@/ui-kit/tables';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { AllCustomers } from '@/types/allCustomers';
import { ChatCircle } from '@phosphor-icons/react';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import { MobileDataTable } from '@/ui-kit/tables';
import { BackLinkButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';
import { CellContext } from '@tanstack/react-table';

const BoxStyle = styled(Box)(({ theme }) => ({
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

interface CustomersOrdersProps {
  customersOrders: AllCustomers[];
}

const tableTitle = 'All Customers';

const CustomersPage = ({ customersOrders }: CustomersOrdersProps) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createChat = useSocketStore((state) => state.createChat);

  const { columns, mobileColumns } = useMemo(() => {
    const getRowActions = (params: CellContext<AllCustomers, unknown>) => (
      <DataGridRowActions
        {...params}
        actions={[
          <DataGridRowActions.Action
            disabled={isCreatingChat || !params?.row?.original.id}
            onClick={async () => {
              if (!params?.row?.original.id || isCreatingChat) return;
              setIsCreatingChat(true);
              createChat({
                userId: params?.row?.original?.id,
              });
            }}
            icon={<ChatCircle size={18} className="text-primary-main" />}
            label="Chat with client"
            key={`chat-with-client-${params.row.id}`}
            showInMenu
          />,
        ]}
      />
    );

    const result: DataGridColDef<AllCustomers>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) => {
          return [row.firstName, row.lastName].filter(Boolean).join(' ');
        },
        meta: {
          mobileColSpan: 2,
          mobileHideLabel: true,
        },
        cell: (params) => {
          return (
            <div className="flex w-full items-center justify-between">
              <span>{params.getValue() as string}</span>
              <div className="md:hidden">{getRowActions(params)}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Client Email',
      },
      {
        accessorKey: 'orders_count',
        header: 'Total Orders',
        meta: {
          flex: 1,
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 155,
        cell: (params) => getRowActions(params),
      },
    ];

    return {
      columns: result,
      mobileColumns: result.filter((col) => col.id !== 'actions'),
    };
  }, [createChat, isCreatingChat]);

  return (
    <div>
      <BackLinkButton />
      <MobileHeading title="Customers" />
      <BoxStyle>
        <NewDataTable
          title={tableTitle}
          columns={columns}
          data={customersOrders}
          hideOnMobile
          // rowHeight={60}
          // sx={{ height: 658 }}
          // getRowId={(row: (typeof customersOrders)[0]) => {
          //   return row?.id || row?.email;
          // }}
        />
        <MobileDataTable
          columns={mobileColumns}
          data={customersOrders}
          title={tableTitle}
          columnsSpaceBetween={true}
          columnNumber={2}
        />
      </BoxStyle>
    </div>
  );
};

export default CustomersPage;
