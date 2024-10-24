import { breakpoints } from './src/lib/theme/breakpoints';

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '#__next',
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: `${breakpoints.values.sm}px`,
      md: `${breakpoints.values.md}px`,
      lg: `${breakpoints.values.lg}px`,
      xl: `${breakpoints.values.xl}px`,
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
      },
      colors: {
        'primary-main': '#5F59FF',
        'primary-dark': '#3733AA',
        'warning-main': '#FF8A00',
        'error-main': '#F45351',
        'error-dark': '#AF0200',
        'text-primary': '#333E5C',
        'text-secondary': '#96A2C1',
        'success-main': '#00D000',
        'success-dark': '#388e3c',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
