import Link from 'next/link';
import MuiLink, { LinkProps } from '@mui/material/Link';

const FooterLink = (props: LinkProps) => {
  const getHref = () => {
    if (!props?.href?.startsWith('/') && !props?.href?.startsWith('#')) {
      return `/${props.href}`;
    }
    return props.href;
  };

  return (
    <MuiLink
      {...props}
      target={props?.href?.startsWith('http') ? '_blank' : undefined}
      href={getHref()}
      sx={{
        color: 'common.white',
        fontSize: '14px',
        ...props.sx,
      }}
      component={Link}
    />
  );
};
export default FooterLink;
