import { Box, Typography } from '@mui/material';
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Image from 'next/image';
import { DataTable } from './DataTable';

export default {
  component: DataTable,
} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = (args) => {
  return <DataTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Default Title',
  rows: [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ],
  columns: [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ],
};

export const Example1 = Template.bind({});
Example1.args = {
  title: 'All Products',
  paginationModel: {
    page: 1,
    pageSize: 25,
  },
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
      },
    },
  },
  rows: [
    {
      id: 1,
      name: {
        name: 'Gaming Headset Logitech',
        subName: 'Colour Black, 210gr',
        image: '',
      },
      type: 'Headset',
      availability: '2/2 channels',
      size: '---',
      last_updated: '8 months ago',
      price: '$99.00',
    },
  ],
  columns: [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      renderCell: (
        params: GridRenderCellParams<{
          name: string;
          subName: string;
          image: string;
        }>,
      ) => {
        const image = params.value?.image;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                padding: '24px 16px 24px 6px',
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt={`${name}-image`}
                  width={40}
                  height={40}
                />
              ) : (
                <Image
                  src="https://i.ibb.co/drQ6ZX5/9.png"
                  alt="test_image"
                  width={40}
                  height={40}
                />
              )}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                {params.value?.name ?? ''}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: 'text.secondary',
                }}
              >
                {params.value?.subName ?? ''}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'availability',
      headerName: 'Availability',
      flex: 1,
    },
    {
      field: 'size',
      headerName: 'Size',
      flex: 1,
    },
    {
      field: 'last_updated',
      headerName: 'Last Updated',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
    },
  ],
};
