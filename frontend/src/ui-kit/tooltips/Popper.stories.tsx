import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Popper } from './Popper';
import { ContainedButton } from '../buttons/ContainedButton';
import usePopper from '@/hooks/usePopper';

export default {
  component: Popper,
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = (args) => {
  const { handleClick, handleClickAway, open, id, anchorEl } =
    usePopper(`popper`);

  return (
    <>
      <ContainedButton aria-describedby={id} onClick={handleClick}>
        Click me
      </ContainedButton>
      <Popper
        {...args}
        id={id}
        open={open}
        onClickAway={handleClickAway}
        anchorEl={anchorEl}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: 'I am a Popper',
};

export const Complex = Template.bind({});
Complex.args = {
  children: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <p>Sign up and create your own business</p>
      <ContainedButton>Sign Up</ContainedButton>
      <ContainedButton>Login</ContainedButton>
    </div>
  ),
};
