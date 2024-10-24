import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from '@mui/system';
import CategoryCard from './CategoryCard';

export default {
  component: CategoryCard,
  title: 'CategoryCard',
} as ComponentMeta<typeof CategoryCard>;

const Template: ComponentStory<typeof CategoryCard> = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <CategoryCard
      category={{
        name: 'Category Name',
        id: 1,
        slug: 'category-name',
        children: [],
      }}
      size="small"
    />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  // Put your args here
};

export const Small = Template.bind({});

Small.args = {
  size: 'small',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'medium',
};
