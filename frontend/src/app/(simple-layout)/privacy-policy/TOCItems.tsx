import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ReactNode } from 'react';
interface Props {
  intro?: ReactNode;
  heading: string;
  children: ReactNode;
}

const SectionHeading = styled((props: TypographyProps<'h3'>) => (
  <Typography component="h3" {...props} />
))<TypographyProps<'h3'>>(({ theme }) => ({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '28px',
  marginTop: '32px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '26px',
    marginTop: '24px',
    marginBottom: '12px',
  },
}));

const TOCItems = ({ intro, heading, children }: Props) => {
  const sectionId = heading;
  return (
    <section id={sectionId} className="section-heading">
      <div>{intro}</div>
      <SectionHeading>{heading}</SectionHeading>
      <div>{children}</div>
    </section>
  );
};

export default TOCItems;
