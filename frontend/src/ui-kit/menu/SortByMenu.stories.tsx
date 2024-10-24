import { useState } from 'react';
import { Box } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SortByMenu, type SortByMenuOption } from './SortByMenu';

export default {
  component: SortByMenu,
  args: {
    title: 'SortByMenu',
  },
} as ComponentMeta<typeof SortByMenu>;

const Template: ComponentStory<typeof SortByMenu> = (args) => {
  const [selected, setSelected] = useState(args.selected);

  const onSelect = (item: SortByMenuOption) => {
    setSelected(item);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <SortByMenu {...args} setSelected={onSelect} selected={selected} />
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {
  selected: {
    name: 'Price - Low to High',
    value: '0',
  },
  options: [
    {
      name: 'Price - Low to High',
      value: '0',
    },
    {
      name: 'Price - High to Low',
      value: '1',
    },
  ],
};

export const ReviewsExample = Template.bind({});
ReviewsExample.args = {
  selected: {
    name: 'Latest',
    value: '0',
  },
  options: [
    {
      name: 'Latest',
      value: '0',
    },
    {
      name: 'Newest',
      value: '1',
    },
    {
      name: 'Most Valuable',
      value: '2',
    },
    {
      name: 'First With a High Rating',
      value: '3',
    },
    {
      name: 'First With a Low Rating',
      value: '4',
    },
  ],
};
