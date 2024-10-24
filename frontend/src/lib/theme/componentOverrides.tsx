import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeOptions } from '@mui/material';
import { CaretDown } from '@phosphor-icons/react';
import { EmptyCheckboxIcon } from '@/assets/icons/EmptyCheckboxIcon';
import { FilledCheckboxIcon } from '@/assets/icons/FilledCheckboxIcon';

// This is for tailwind
const rootElement =
  typeof document !== 'undefined' ? document.getElementById('__next') : null;

// https://mui.com/material-ui/customization/theme-components/#global-style-overrides
const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      '*': {
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track ': {
          backgroundColor: theme.palette.common.white,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.text.secondary,
          borderRadius: '20px',
        },
      },
      '*,::before,::after': {
        borderWidth: 0,
        borderStyle: 'solid',
      },
    }),
  },
  MuiPopover: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiPopper: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiDialog: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiModal: {
    defaultProps: {
      container: rootElement,
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        '& .MuiSwitch-switchBase': {
          padding: 3,
          '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: ownerState.color,
            },
          },
        },
      }),
      track: ({ theme, ownerState }) => ({
        borderRadius: 20,
        backgroundColor: theme.palette.text.secondary,

        ...(ownerState.checked && {
          opacity: 1,
        }),
      }),
      thumb: ({ theme }) => ({
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
          duration: 200,
        }),
      }),
      switchBase: ({ ownerState, theme }) => ({
        padding: 3,

        ...(ownerState.checked && {
          transform: 'translateX(12px)',
          color: theme.palette.common.white,
        }),
      }),
    },
  },
  MuiSlider: {
    styleOverrides: {
      rail: ({ theme }) => ({
        opacity: 1,
        backgroundColor: theme.palette.text.secondary,
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        /* boxShadow: '0px 0.5008620619773865px 6.636422634124756px 0px #00000005', */

        boxShadow:
          '0px 0.5008620619773865px 6.636422634124756px 0px #00000005, 0px 4px 53px 0px #0000000A',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        margin: '0 0 8px 0',
        fontSize: 12,
        lineHeight: 1.333,
        fontWeight: 500,
        color: t.palette.text.primary,
      }),
      focused: ({ theme: t }) => ({
        color: t.palette.text.primary,
      }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      icon: <EmptyCheckboxIcon />,
      checkedIcon: <FilledCheckboxIcon />,
    },
    styleOverrides: {
      root: {
        width: '18px',
        height: '18px',
        padding: 0,
        borderRadius: '2px',
        overflow: 'hidden',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      outlinedPrimary: ({ theme: t }) => ({
        borderColor: t.palette.primary.main,
        '&:hover': {
          borderColor: t.palette.primary.dark,
          color: t.palette.primary.dark,
          backgroundColor: 'transparent',
        },
      }),
      root: () => ({
        boxShadow: 'none',

        '&:hover': {
          boxShadow: 'none',
        },
        '&.Mui-focusVisible': {
          boxShadow: 'none',
        },
      }),
      sizeLarge: {
        padding: '15px 0px',
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      IconComponent: CaretDown,
      MenuProps: {
        PaperProps: {
          sx: {
            boxShadow: 'none',
            outline: `1px solid`,
            outlineColor: `text.primary`,
            borderRadius: '0 0 10px 10px',
            maxHeight: 200,
          },
        },
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.grey[400],
      }),
    },
  },
  MuiIcon: {
    styleOverrides: {
      root: ({ ownerState, theme: t }) => ({
        ...(ownerState.variant === 'outlined' &&
          ownerState.color === 'primary' && {
            borderColor: t.palette.primary.main,
            ':hover': {
              borderColor: t.palette.primary.dark,
              color: t.palette.primary.dark,
            },
          }),
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      filled: ({ theme }) => ({
        backgroundColor: theme.palette.grey[400],
      }),
    },
  },
  MuiAutocomplete: {
    defaultProps: {
      clearIcon: false,
    },
    styleOverrides: {
      paper: ({ theme, ownerState: { options, multiple, freeSolo } }) => ({
        boxShadow: 'none',

        ...(options.length === 0 && multiple && freeSolo
          ? {}
          : {
              outline: `1px solid ${theme.palette.text.primary}`,
            }),

        borderRadius: '0 0 10px 10px',
      }),
      input: () => {
        return {
          paddingLeft: '0 !important',
        };
      },
      inputRoot: ({ ownerState: { options, multiple, freeSolo, value } }) => ({
        paddingLeft: '16px',
        paddingRight: '16px !important',

        ...(Array.isArray(value) && {
          paddingTop: '4px',
          paddingBottom: '4px',
        }),
        '&.Mui-focused': {
          ...(options.length === 0 && multiple && freeSolo
            ? {}
            : {
                borderRadius: '10px 10px 0 0 !important',
              }),
        },
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      divider: ({ theme }) => ({
        borderColor: theme.palette.grey[400],
      }),
    },
  },
  MuiPagination: {
    defaultProps: {
      shape: 'rounded',
      color: 'primary',
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      menu: () => ({
        '& .MuiPaper-root': {
          borderRadius: '1rem',
          boxShadow:
            '0px 43px 203px rgba(0, 0, 0, 0.05), 0px 12.9632px 61.1986px rgba(0, 0, 0, 0.0325794), 0px 5.38427px 25.4188px rgba(0, 0, 0, 0.025), 0px 1.94738px 9.19346px rgba(0, 0, 0, 0.0174206)',
        },
      }),
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      ellipsis: () => ({
        color: '#8C8C8C',
      }),
      textPrimary: ({ theme }) => ({
        fontSize: '14px',
        lineHeight: '16.94px',
        fontWeight: 400,
        color: '#2D2D2D',

        '&.MuiPaginationItem-page': {
          border: `1px solid ${theme.palette.grey[400]}`,
        },

        '&.Mui-selected': {
          border: 0,
          color: `${theme.palette.common.white} !important`,
        },
      }),
      previousNext: ({ theme }) => ({
        border: `1px solid ${theme.palette.grey[400]}`,
        fontSize: '14px',
        lineHeight: '16.94px',
        fontWeight: 400,
        color: '#2D2D2D',
      }),
      page: ({ theme }) => ({
        '&.MuiPaginationItem-root': {
          color: theme.palette.text.secondary,
        },
      }),
    },
  },
};

export default components;
