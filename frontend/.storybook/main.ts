/* @type {import('@storybook/core-common').StorybookConfig} */
module.exports = {
  stories: [
    {
      directory: '../src/ui-kit',
      titlePrefix: 'UI Kit',
      files: '**/*.stories.tsx',
    },
    {
      directory: '../src/components',
      titlePrefix: 'Components',
      files: '**/*.stories.tsx',
    },
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {},
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
