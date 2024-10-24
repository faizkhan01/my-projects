import { Attachment } from '@/types/attachment';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ReviewCard from './ReviewCard';

export default {
  title: 'ReviewCard',
  component: ReviewCard,
} as ComponentMeta<typeof ReviewCard>;

const reviewImages = [
  {
    id: 1,
    fileName: 'headephone-01.png',
    url: 'https://i.ibb.co/XyPNMY5/headephone-01.png',
  },
  {
    id: 2,
    fileName: 'headephone-02.png',
    url: 'https://i.ibb.co/QJ92T2T/headephone-02.png',
  },
  {
    id: 3,
    fileName: 'headephone-03.png',
    url: 'https://i.ibb.co/VHC5jN3/headephone-03.png',
  },
  {
    id: 4,
    fileName: 'headephone-04.png',
    url: 'https://i.ibb.co/P54nFTC/headephone-04.png',
  },
];

const Template: ComponentStory<typeof ReviewCard> = (args) => (
  <ReviewCard {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  review: {
    id: 1,
    images: reviewImages as Attachment[],
    rating: 4,
    comment:
      'Cap table joining consumer social app. Generalist-reading secondary markets buyer. First mover-advantage TechCrunch reader. Google Employee DeFi hacking. Ex-Uber resume flexing, FAANG worker. Chamath-like, sketchy venture capitalist. Substack blogging Thiel Fellow dropout. Friends and Family raising, rationalist Job-seeker Cap table joining consumer social app.',
    createdAt: new Date('11 January 2022').toString(),
    author: {
      id: 1,
      firstName: 'Federica',
      lastName: 'Pellegrini',
    },
  },
};
