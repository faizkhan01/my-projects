import { memo } from 'react';
import useMenu from '@/hooks/useMenu';
import { Box, Button, Typography } from '@mui/material';
import { CaretDown, Check } from '@phosphor-icons/react';
import { Menu } from './Menu';
import { styled } from '@mui/material/styles';
import { MenuItem } from './MenuItem';

const StyledTypography = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '18px',
}));

const StyledSpan = styled('span')(() => ({
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '18px',
}));

export interface SortByMenuOption {
  name: string;
  value: string | number;
}

interface Props {
  selected: SortByMenuOption;
  options: SortByMenuOption[];
  setSelected: (item: SortByMenuOption) => void;
  closeOnSelect?: boolean;
}

export const SortByMenu = memo(
  ({ options, selected, setSelected, closeOnSelect = false }: Props) => {
    const { anchorEl, buttonId, menuId, handleClick, handleClose, open } =
      useMenu();

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <StyledTypography mr={0.5}>Sort By:</StyledTypography>
          <Button
            onClick={(evt) => handleClick(evt)}
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <StyledSpan
              sx={{
                color: 'primary.main',
                pr: '8px',
              }}
            >
              {selected.name}
            </StyledSpan>
            <Box
              sx={{
                color: 'primary.main',
              }}
            >
              <CaretDown size={18} />
            </Box>
          </Button>
        </Box>
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': buttonId,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {options.map((item) => (
            <MenuItem
              key={item.value}
              divider
              onClick={() => {
                if (closeOnSelect) {
                  handleClose();
                }
                setSelected(item);
              }}
              value={item.value}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '16px' },
                    lineHeight: '18px',
                    color:
                      item.value === selected.value
                        ? 'text.primary'
                        : 'text.secondary',
                  }}
                >
                  {item.name}
                </Typography>
                {item.value === selected.value ? <Check /> : null}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  },
);

SortByMenu.displayName = 'SortByMenu';
