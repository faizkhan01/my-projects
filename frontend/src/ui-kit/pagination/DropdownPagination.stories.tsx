import React, { useState } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DropdownPagination } from './DropdownPagination';

export default {
  title: 'Pagination',
  component: DropdownPagination,
} as ComponentMeta<typeof DropdownPagination>;

const Template: ComponentStory<typeof DropdownPagination> = (args) => {
  const [page, setPage] = useState(args.page);
  const [perPage, setPerPage] = useState(args.perPage);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const onPerPageChange = (perPage: number) => {
    setPerPage(perPage);
  };

  return (
    <>
      <DropdownPagination
        {...args}
        page={page}
        perPage={perPage}
        perPageOptions={[5, 10, 25, 50]}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </>
  );
};

export const Few = Template.bind({});
Few.args = {
  perPage: 10,
  page: 1,
  total: 30,
};

export const Many = Template.bind({});
Many.args = {
  perPage: 10,
  page: 1,
  total: 350,
};
