import { ComponentStory, ComponentMeta } from '@storybook/react';
import ReviewsOverview from './ReviewsOverview';

export default {
  title: 'Rating',
  component: ReviewsOverview,
} as ComponentMeta<typeof ReviewsOverview>;

const Template: ComponentStory<typeof ReviewsOverview> = (args) => (
  <ReviewsOverview {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  ratingData: {
    rating_5: 5,
    rating_4: 0,
    rating_3: 0,
    rating_1: 0,
    rating_2: 0,
    average: 5,
  },
};
