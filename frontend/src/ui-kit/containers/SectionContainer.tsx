import Link from 'next/link';
import { Button, Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';
import { ArrowUpRight } from '@/components/icons';

export interface SectionContainerProps {
  title?: string;
  viewAll?: string | (() => void);
  children: ReactNode;
  typographyProps?: TypographyProps<'h3'>;
}

export const SectionContainer = ({
  title,
  children,
  viewAll,
  typographyProps,
}: SectionContainerProps) => {
  const isUrl = typeof viewAll === 'string';

  return (
    <div className="flex flex-col gap-[22px] sm:gap-8">
      {title && (
        <div className="flex flex-row items-end justify-between">
          <Typography
            component={isUrl ? Link : 'h3'}
            href={isUrl ? viewAll : undefined}
            sx={{
              ...(viewAll
                ? {
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }
                : {}),

              color: 'text.primary',
              fontSize: {
                xs: '28px',
                sm: '40px',
              },
              fontWeight: 600,
              textDecoration: 'none',
              lineHeight: {
                xs: '33.6px',
                sm: '48px',
              },
            }}
            {...typographyProps}
          >
            {title}
          </Typography>
          {viewAll && (
            <Button
              component={isUrl ? Link : 'button'}
              onClick={isUrl ? undefined : viewAll}
              href={isUrl ? viewAll : undefined}
              sx={{
                color: 'primary.main',
                lineHeight: '24px',
                fontSize: {
                  xs: '16px',
                  sm: '18px',
                },
                fontWeight: 600,
                gap: '8px',
                padding: '0',
                height: 'fit-content',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.dark',
                },
              }}
              disableRipple
            >
              View All
              <ArrowUpRight size={18} weight="bold" />
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
