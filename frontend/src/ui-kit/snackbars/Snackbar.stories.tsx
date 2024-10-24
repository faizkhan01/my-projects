import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Snackbar } from './Snackbar';
import { ContainedButton } from '../buttons/ContainedButton';

export default {
  component: Snackbar,
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = (args) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <ContainedButton onClick={handleClick}>Click me</ContainedButton>
      <Snackbar open={open} onClose={handleClose} {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  message: 'This is a snackbar',
};

export const Error = Template.bind({});
Error.args = {
  severity: 'error',
  message: 'This is an error snackbar',
};

export const Warning = Template.bind({});
Warning.args = {
  severity: 'warning',
  message: 'This is a warning snackbar',
};

export const Info = Template.bind({});
Info.args = {
  severity: 'info',
  message: 'This is an info snackbar',
};
