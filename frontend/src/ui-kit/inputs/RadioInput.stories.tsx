import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RadioInput } from './RadioInput';

export default {
  component: RadioInput,
} as ComponentMeta<typeof RadioInput>;

const Template: ComponentStory<typeof RadioInput> = (args) => (
  <RadioInput {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Label',
};
