import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ProductCard from './ProductCard';

export default {
  component: ProductCard,
  args: {
    title: 'ProductCard',
  },
} as ComponentMeta<typeof ProductCard>;

const Template: ComponentStory<typeof ProductCard> = () => (
  <ProductCard
    isCart={false}
    isWish={false}
    isFreeShipping={false}
    currency="USD"
    exchangeRate={1}
    product={{
      id: 5,
      name: 'Steelseries / React Esports Performance Mouse',
      slug: 'Steelseries / React Esports Performance Mouse',
      description: '',
      currency: 'USD',
      price: 169.0,
      sku: 'SKU-1',
      stock: 10,
      store: {
        id: 5,
        name: 'Ahsan',
        slug: 'Ahsan',
        verified: true,
      },
      discount: 0,
      rating: 4,
      totalReviews: 123,
      images: [],
      published: true,
      tags: [],
      deletedAt: null,
      createdAt: 0,
    }}
  />
);

export const Primary = Template.bind({});
Primary.args = {
  /* the args you need here will depend on your component */
};
