import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AnswerButton } from './AnswerButton';

export default {
  component: AnswerButton,
  args: {
    title: 'AnswerButton',
  },
} as ComponentMeta<typeof AnswerButton>;

const Template: ComponentStory<typeof AnswerButton> = () => <AnswerButton />;

export const Primary = Template.bind({});
Primary.args = {
  /* the args you need here will depend on your component */
};
