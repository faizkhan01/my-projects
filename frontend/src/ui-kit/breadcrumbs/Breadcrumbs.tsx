import {
  BreadcrumbsProps as MuiBreadcrumbsProps,
  Link as MuiLink,
  Breadcrumbs as MuiBreadcrumbs,
} from '@mui/material';
import Link from 'next/link';

export interface BreadcrumbsProps extends MuiBreadcrumbsProps {
  links: {
    name: string;
    href?: string;
  }[];
}

export const Breadcrumbs = ({ links, sx, ...props }: BreadcrumbsProps) => {
  const lastLink = links[links.length - 1].name;

  return (
    <MuiBreadcrumbs
      sx={{
        display: { md: 'block', xs: 'none' },
        ...sx,
      }}
      separator="•"
      aria-label="breadcrumb"
      {...props}
    >
      {links.map((link) => {
        const isLastLink = link.name === lastLink;

        return (
          <MuiLink
            key={link.name}
            component={isLastLink ? 'span' : Link}
            fontSize={12}
            underline="hover"
            color={isLastLink ? 'primary' : 'inherit'}
            fontWeight={isLastLink ? 600 : 400}
            href={link.href}
          >
            {link.name}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
};
