import { Meta, StoryObj } from '@storybook/react';
import MobileDataGrid from './MobileDataGrid';
import { faker } from '@faker-js/faker';
import { createColumnHelper } from '@tanstack/react-table';
import { LinearProgress } from '@mui/material';

const meta: Meta<typeof MobileDataGrid> = {
  component: MobileDataGrid,
};

type Story = StoryObj<typeof MobileDataGrid>;

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
      <MobileDataGrid
        data={getData(1000)}
        columnNumber={2}
        columns={[
          columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
            id: 'fullName',
            header: 'Name',
            meta: {
              mobileColSpan: 2,
            },
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
          columnHelper.accessor('status', {
            header: 'Status',
          }),
        ]}
      />
    );
  },
};

export default meta;
