import { DataTable } from '@/ui-kit/tables';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { GridColDef } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { ContainedButton } from '@/ui-kit/buttons';

const StyledBox = styled(Box)(({ theme }) => ({
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

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
  },
  {
    field: 'starts',
    headerName: 'Starts',
    width: 300,
  },
  {
    field: 'ends',
    headerName: 'Ends',
    width: 280,
  },
  {
    field: 'value',
    headerName: 'Value',
    width: 100,
    renderCell: (params) => (
      <Box
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: params.value === 'unpaid' ? '#F45351' : '#5F59FF',
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
          {params.value}
        </span>
      </Box>
    ),
  },
];

const rows = [
  {
    id: 1,
    name: 'Happy ever day!',
    starts: 'Feb 21, 2022 10:47 am',
    ends: 'Feb 25, 2022 10:47 am',
    value: 'paid',
  },
  {
    id: 2,
    name: 'Happy ever day!',
    starts: 'Feb 21, 2022 10:22 am',
    ends: 'Feb 25, 2022 10:47 am',
    value: 'paid',
  },
  {
    id: 3,
    name: 'Happy ever day!',
    starts: 'Feb 21, 2022 9:01 am',
    ends: 'Feb 25, 2022 10:47 am',
    value: 'paid',
  },
  {
    id: 4,
    name: 'Happy ever day!',
    starts: 'Feb 20, 2022 14:08 pm',
    ends: 'Feb 25, 2022 10:47 am',
    value: 'paid',
  },
  {
    id: 5,
    name: 'Happy ever day!',
    starts: 'Feb 20, 2022 8:23 am',
    ends: 'Feb 25, 2022 10:47 am',
    value: 'paid',
  },
];

const DiscounterPage = () => {
  return (
    <Box>
      <Box
        mb={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontSize={24} lineHeight="32px" fontWeight={600}>
          Sales
        </Typography>
        <Box>
          <ContainedButton>Create Sale</ContainedButton>
        </Box>
      </Box>
      <StyledBox>
        <DataTable
          title={'All sales'}
          columns={columns}
          rows={rows}
          checkboxSelection={false}
          rowHeight={60}
          sx={{
            height: 658,
          }}
        />
      </StyledBox>
    </Box>
  );
};

export default DiscounterPage;
