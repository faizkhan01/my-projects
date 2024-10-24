import { DataGrid } from './DataGrid';
import { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';
import { LinearProgress } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';

const meta: Meta<typeof DataGrid> = {
  component: DataGrid,
};

type Story = StoryObj<typeof DataGrid>;

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}

const getData = (count: number): Person[] => {
  const arr: Person[] = [];

  for (let i = 0; i < count; i++) {
    arr.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 99 }),
      visits: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(['Married', 'Single', 'Divorced']),
      progress: faker.number.int({ min: 0, max: 100 }),
    });
  }

  return arr;
};

export const Default: Story = {
  render: () => {
    const columnHelper = createColumnHelper<Person>();
    return (
      <div className="h-[500px] shadow">
        <DataGrid
          // checkboxSelection
          columns={[
            columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
              id: 'fullName',
              header: 'Name',
            }),
            columnHelper.accessor('progress', {
              header: 'Progress',
              cell: ({ getValue }) => {
                return (
                  <LinearProgress
                    value={getValue()}
                    variant="determinate"
                    className="w-full"
                  />
                );
              },
            }),
          ]}
          data={getData(10000)}
        />
      </div>
    );
  },
};

export default meta;
