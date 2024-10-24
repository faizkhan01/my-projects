import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Image from 'next/image';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { Box, Menu, MenuItem, Button } from '@mui/material';
import { MenuProps } from '@mui/material/Menu';
import { CaretDown } from '@phosphor-icons/react';
import { SubHeading2 } from '../typography';
import { DROPDOWN_BUTTON_VARIANTS } from '@/constants/dropdownButtonVariants';
import useMenu from '@/hooks/useMenu';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 4,
    marginTop: theme.spacing(1),
    '& .MuiMenu-list': {
      padding: 0,
      borderRadius: '4px',
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: 'transparent,',
    },
    '& .MuiMenuItem-root': {
      padding: '6px 22px',
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.primary,
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50],
      },
      '&:active': {
        backgroundColor: theme.palette.grey[50],
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[50],
  '& .MuiButton-endIcon': {
    marginLeft: '4px',
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
}));

interface DataItem {
  id: number;
  name: string;
  icon: string;
  from?: string;
  to?: string;
}

interface DropdownButtonType {
  variant?: 'default' | 'transparent' | string;
  setSelected?:
    | Dispatch<SetStateAction<number>>
    | Dispatch<SetStateAction<number | null>>;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  items?: string[];
  dataItems?: DataItem[];
  color?: string;
  sx?: SxProps<Theme>;
  boxSx?: SxProps<Theme>;
  withLocale?: boolean;
  localePath?: string;
}
export const DropdownButton = memo(
  ({
    color,
    variant = 'default',
    setSelected = () => null,
    setCurrentPage,
    items = [],
    dataItems = [],
    sx,
    boxSx,
  }: DropdownButtonType) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const isDataItems = dataItems.length > 0;
    const { open, anchorEl, handleClick, handleClose, menuId, buttonId } =
      useMenu();

    const handleChange = useCallback(
      (_: React.MouseEvent<HTMLElement>, index: number) => {
        if (setCurrentPage) setCurrentPage(1);
        setSelectedIndex(index);
        handleClose();
        if (dataItems.length > 0) {
          setSelected(dataItems[index].id);
        }
        if (items.length > 0) setSelected(index);
      },
      [dataItems, items.length, setCurrentPage, setSelected, handleClose],
    );

    const DEFAULT_STYLES = useMemo(
      () => ({
        height: '40px',
        maxWidth: '1700px',
        textTransform: 'none',
        padding: '0px 0px',
        '& .MuiButton-endIcon': {
          transform: open && 'rotate(180deg)',
          transition: '0.4s',
        },
      }),
      [open],
    );

    const VariantStyleButton = useMemo(() => {
      if (variant === DROPDOWN_BUTTON_VARIANTS.DEFAULT) {
        return {
          ...DEFAULT_STYLES,
          backgroundColor: 'transparent',
          borderColor: 'grey.400',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'text.primary',
            backgroundColor: 'transparent',
          },
        };
      }
      if (variant === DROPDOWN_BUTTON_VARIANTS.TRANSPARENT) {
        return {
          ...DEFAULT_STYLES,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'grey.50',
          },
        };
      }
      return {};
    }, [DEFAULT_STYLES, variant]);

    return (
      <Box sx={{ ...boxSx }}>
        <StyledButton
          id={buttonId}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="outlined"
          disableElevation
          sx={{ ...sx, ...VariantStyleButton }}
          color="inherit"
          onClick={handleClick}
          endIcon={<CaretDown />}
        >
          {isDataItems && (
            <Box
              sx={{
                borderRadius: '50%',
                mr: '8px',
              }}
              component="span"
            >
              <Image
                src={dataItems[selectedIndex].icon}
                alt={''}
                width={18}
                height={18}
              />
            </Box>
          )}
          <SubHeading2
            color={color}
            component="span"
            title={
              dataItems.length > 0
                ? dataItems[selectedIndex]?.name
                : items[selectedIndex]
            }
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {dataItems.length > 0
              ? dataItems[selectedIndex]?.name
              : items[selectedIndex]}
          </SubHeading2>
        </StyledButton>
        <StyledMenu
          id={menuId}
          MenuListProps={{
            'aria-labelledby': buttonId,
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {isDataItems &&
            dataItems.map((el, index) => (
              <MenuItem
                key={el.id}
                onClick={(e) => handleChange(e, index)}
                disableRipple
                sx={selectedIndex === index ? { background: 'grey.50' } : {}}
              >
                {el.icon && (
                  <Box
                    sx={{
                      borderRadius: '50%',
                      mr: '8px',
                    }}
                  >
                    <Image
                      src={el.icon}
                      width={18}
                      height={18}
                      alt={dataItems[selectedIndex]?.name || ''}
                    />
                  </Box>
                )}
                {el.name}
              </MenuItem>
            ))}
          {items.length > 0 &&
            items.map((el, index: number) => (
              <MenuItem
                key={el}
                onClick={(e) => handleChange(e, index)}
                disableRipple
                sx={selectedIndex === index ? { background: 'grey.50' } : {}}
              >
                {el}
              </MenuItem>
            ))}
        </StyledMenu>
      </Box>
    );
  },
);

DropdownButton.displayName = 'DropdownButton';
