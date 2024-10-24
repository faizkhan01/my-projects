'use client';
import { FC } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import Grid from '@mui/material/Grid';
import FooterLink from './FooterLink';
import { CustomContainer } from '@/ui-kit/containers';
import FooterTextField from './FooterTextField';
import FooterSocialIcons from './FooterSocialIcons';
import Logo from '@/assets/icons/Logo';
import { PageFooter } from '@/types/page-section';
import { Accordion } from '@/ui-kit/accordions';
import { Typography } from '@mui/material';

interface FooterInfoMobileProps {
  data: PageFooter | null;
}

const FooterInfoMobile: FC<FooterInfoMobileProps> = ({ data }) => (
  <div className="block sm:hidden">
    <CustomContainer>
      <div className="bg-primary-main">
        <Grid
          container
          sx={{
            display: 'grid',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <Grid item sx={{ marginTop: '48px' }}>
            <Accordion type="single">
              {data?.map(({ name, links }) => {
                const replacedTitle = name.replace(/\s/g, '-');
                return (
                  <Grid key={`${name}-mobile`}>
                    <div>
                      <Accordion.Item
                        value={replacedTitle}
                        className="border-0"
                      >
                        <Accordion.Summary
                          expandIcon={
                            <CaretDown size={16} className="text-white" />
                          }
                          expandRotation="right-to-down"
                          className="text-white"
                        >
                          <Typography
                            component="h5"
                            sx={{
                              fontWeight: '600',
                            }}
                          >
                            {name}
                          </Typography>
                        </Accordion.Summary>
                        <Accordion.Details disablePadding>
                          <Typography className="flex flex-col gap-4 px-0 pb-2 pt-1">
                            {links.map((link, i) => (
                              <FooterLink
                                key={`${link.name}-${link.href}-${i}-mobile`}
                                href={link.href}
                              >
                                {link.name}
                              </FooterLink>
                            ))}
                          </Typography>
                        </Accordion.Details>
                      </Accordion.Item>
                    </div>
                  </Grid>
                );
              })}
            </Accordion>

            {/* logo */}
            <div>
              <div className="mt-5 grid justify-center">
                <div>
                  <FooterTextField />
                </div>
                <div className="mb-2 mt-10 grid justify-center">
                  <Logo variant="full-white" height={30} width={180} />
                </div>
                {/* copy right */}
                <div className="py-4 text-[12px]">
                  <CustomContainer>
                    Copyright © {new Date().getFullYear()} Only Latest, Inc.
                    All rights reserved
                    <div className="mb-[34px] mt-5 flex justify-center gap-4">
                      <FooterSocialIcons />
                    </div>
                  </CustomContainer>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </CustomContainer>
  </div>
);

export default FooterInfoMobile;
