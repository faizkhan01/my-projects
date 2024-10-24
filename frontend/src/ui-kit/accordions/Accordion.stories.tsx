import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from './Accordion';
import { Typography } from '@mui/material';

const meta: Meta = {
  component: (args) => {
    return (
      <Accordion type="single" {...args}>
        <Accordion.Item value="1">
          <Accordion.Summary>
            <Typography>Accordion 1</Typography>
          </Accordion.Summary>
          <Accordion.Details>
            <Typography>Accordion 1 details</Typography>
          </Accordion.Details>
        </Accordion.Item>
        <Accordion.Item value="2">
          <Accordion.Summary>
            <Typography>Accordion 2</Typography>
          </Accordion.Summary>
          <Accordion.Details>
            <Typography>Accordion 2 details</Typography>
          </Accordion.Details>
        </Accordion.Item>
        <Accordion.Item value="3">
          <Accordion.Summary>
            <Typography>Accordion 3</Typography>
          </Accordion.Summary>
          <Accordion.Details>
            <Typography>Accordion 3 details</Typography>
          </Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};
