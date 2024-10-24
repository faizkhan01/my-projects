import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Menu, MenuProps } from './Menu';

export default {
  component: Menu,
  args: {
    title: 'Menu',
  },
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = (args: MenuProps) => (
  <Menu {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
};
