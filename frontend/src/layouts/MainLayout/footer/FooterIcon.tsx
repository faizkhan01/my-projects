import { IconButton } from '@mui/material';

interface FooterIconProps {
  icon: React.ReactNode;
  href?: string;
  target?: string;
}

const FooterIcon = ({ icon, href = '', target }: FooterIconProps) => (
  <IconButton
    sx={(theme) => ({
      padding: 0,
      '& path': {
        transition: 'all .3s ease',
      },
      '&:hover path:nth-of-type(1)': {
        fill: 'white',
        transition: 'all 0.3s',
      },

      '&:hover path': {
        fill: theme.palette.primary.main,
        transition: 'all 0.3s',
      },
    })}
    href={href}
    target={target}
  >
    {icon}
  </IconButton>
);

export default FooterIcon;
