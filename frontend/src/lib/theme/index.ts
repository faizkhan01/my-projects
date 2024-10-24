import { createTheme } from '@mui/material/styles';
import components from './componentOverrides';
import { roboto } from './font';
import { breakpoints } from './breakpoints';

export const theme = createTheme({
  breakpoints,
  palette: {
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    primary: {
      dark: '#3733AA',
      light: '#13D7FF',
      main: '#5F59FF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      dark: '#AF0200',
      main: '#F45351',
      light: '#FFD9D9',
    },
    error: {
      dark: '#AF0200',
      main: '#F45351',
      light: '#FFD9D9',
    },
    success: {
      main: '#00D000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF8A00',
    },
    info: {
      main: '#EEEDFF',
    },
    text: {
      primary: '#333E5C',
      secondary: '#96A2C1',
    },
    grey: {
      50: '#F6F9FF',
      100: 'rgba(51,62,92,0.1)',
      200: 'rgba(51,62,92,0.7)',
      400: '#EAECF4',
      800: '#1A1F2F',
      900: '#131316',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
    },
    action: {
      // INFO: https://mui.com/customization/default-theme/#default-theme
      /* active: '#5F59FF', */
      /* hover: '#3733AA', */
      /* selected: '#3733AA', */
      disabled: '#96A2C1',
      disabledBackground: '#EAECF4',
      /* focus: '#3733AA', */
    },
  },
  components,
  typography: {
    htmlFontSize: 14,
    fontFamily: roboto.style.fontFamily,
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: 64,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h2: {
      fontWeight: 500,
      fontSize: 48,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h3: {
      fontWeight: 500,
      fontSize: 40,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 500,
      fontSize: 32,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h5: {
      fontWeight: 500,
      fontSize: 24,
      lineHeight: 1.333,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.333,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.1375,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.125,
      letterSpacing: '0em',
    },
    body1: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.142,
      letterSpacing: '0em',
    },
    body2: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.6,
      letterSpacing: '0em',
    },
    button: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.125,
      letterSpacing: '0em',
      textTransform: 'none',
    },
    caption: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1,
      letterSpacing: '0em',
    },
  },
});
