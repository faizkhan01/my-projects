import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormInput } from './FormInput';

export default {
  component: FormInput,
  args: {
    id: 'input',
    label: 'Input',
    placeholder: 'Enter text here',
  },
} as ComponentMeta<typeof FormInput>;

const Template: ComponentStory<typeof FormInput> = (args) => (
  <FormInput {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithError = Template.bind({});
WithError.args = {
  errorMessage: 'This is an error message',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: 'This a hidden label',
  hideLabel: true,
};
