import { styled } from '@mui/material/styles';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';

interface CarouselDotProps extends ButtonBaseProps {
  selected: boolean;
}

const CarouselDot = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<CarouselDotProps>(({ theme, selected }) => ({
  cursor: 'pointer',
  height: '10px',
  width: '10px',
  borderRadius: '50%',
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.grey[400],
  transition: 'background-color .3s ease',

  ':hover': {
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.primary.dark,
    transition: 'background-color .3s ease',
  },

  [theme.breakpoints.down('sm')]: {
    height: '6px',
    width: '6px',
  },
}));

export default CarouselDot;
