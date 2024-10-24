import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormCheckbox } from './FormCheckbox';

export default {
  component: FormCheckbox,
  args: {
    label: 'Checkbox',
  },
} as ComponentMeta<typeof FormCheckbox>;

const Template: ComponentStory<typeof FormCheckbox> = (args) => (
  <FormCheckbox {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithError = Template.bind({});
WithError.args = {
  error: true,
};
