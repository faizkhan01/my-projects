import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../src/lib/theme';
import 'src/app/globals.css';
import { Preview } from '@storybook/react';

import {
  withThemeByClassName,
  withThemeFromJSXProvider,
} from '@storybook/addon-styling';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    // Adds theme switching support.
    (Story) => (
      <div id="__next">
        <Story />
      </div>
    ),
    withThemeFromJSXProvider({
      Provider: ThemeProvider,
      themes: {
        default: theme,
      },
      defaultTheme: 'default',
      GlobalStyles: CssBaseline,
    }),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }), // Adds theme switching support.
  ],
};

export default preview;
