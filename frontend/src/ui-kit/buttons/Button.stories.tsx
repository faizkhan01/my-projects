import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';
import { Heart } from '@phosphor-icons/react';

const meta: Meta = {
  component: (args) => {
    return (
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Primary</span>
          <Button {...args} color="primary" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Error</span>
          <Button {...args} color="error" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Success</span>
          <Button {...args} color="success" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Loading</span>
          <Button {...args} loading />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">Disabled</span>
          <Button {...args} disabled />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Contained: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
  },
};

export const Outlined: Story = {
  args: {
    ...Contained.args,
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    ...Contained.args,
    variant: 'text',
  },
};

export const Link: Story = {
  args: {
    ...Contained.args,
    href: '#',
  },
};

export const WithIcon: Story = {
  args: {
    ...Contained.args,
    startIcon: <Heart />,
  },
};

export const UpperCase: Story = {
  args: {
    ...Contained.args,
    uppercase: true,
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div className="space-x-4">
        <Button size="medium" variant="contained">
          Medium
        </Button>
        <Button size="large" variant="contained">
          Large
        </Button>
      </div>
    );
  },
};

export const FullWidth: Story = {
  args: {
    ...Contained.args,
    fullWidth: true,
  },
  render: (args) => <Button {...args} />,
};
