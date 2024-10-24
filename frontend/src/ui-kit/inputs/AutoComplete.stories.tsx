import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AutoComplete from './AutoComplete';

export default {
  component: AutoComplete,
  title: 'Components/AutoComplete',
} as ComponentMeta<typeof AutoComplete>;

const Template: ComponentStory<typeof AutoComplete> = () => <AutoComplete />;

export const Default = Template.bind({});

// Default.args = {
// Put your args here
// };

export const WithError = Template.bind({});
// WithError.args = {
// Put your args here
// };
