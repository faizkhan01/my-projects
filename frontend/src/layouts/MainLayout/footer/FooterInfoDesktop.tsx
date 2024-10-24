'use client';
import { FC } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CustomContainer } from '@/ui-kit/containers';
import FooterTextField from './FooterTextField';
import FooterLink from './FooterLink';
import FooterSocialIcons from './FooterSocialIcons';
import Logo from '@/assets/icons/Logo';
import { PageFooter } from '@/types/page-section';

interface FooterInfoDesktopProps {
  data: PageFooter | null;
}

const FooterInfoDesktop: FC<FooterInfoDesktopProps> = ({ data }) => (
  <div className="hidden flex-col sm:flex">
    <CustomContainer>
      <div className="flex flex-wrap gap-[60px] pb-8 pt-16">
        <div className="flex flex-col">
          <div className="mb-6">
            <Logo variant="full-white" height={30} width={180} />
          </div>
          <FooterTextField />

          <div className="mt-4 flex gap-6">
            <FooterSocialIcons />
          </div>
        </div>
        <Grid
          container
          columnSpacing={4}
          rowSpacing={2}
          sx={{
            flex: {
              md: 1,
            },
            justifyContent: {
              lg: 'flex-end',
            },
          }}
        >
          {data?.map(({ name, links }) => (
            <Grid
              key={name}
              item
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem',
              }}
              xs={12}
              sm={3}
            >
              <Typography
                component="h5"
                variant="subtitle1"
                sx={{
                  fontWeight: '600',
                }}
              >
                {name}
              </Typography>
              <div className="flex flex-col gap-4">
                {links.map((link, i) => (
                  <FooterLink
                    key={`${link.name}-${link.href}-${i}`}
                    sx={{
                      color: 'common.white',
                      fontSize: '14px',
                    }}
                    href={link.href}
                  >
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </CustomContainer>

    <div className="border-t-[#8884FF] py-4 text-[12px]">
      <CustomContainer>
        Copyright © {new Date().getFullYear()} Only Latest, Inc. All rights
        reserved
      </CustomContainer>
    </div>
  </div>
);

export default FooterInfoDesktop;
