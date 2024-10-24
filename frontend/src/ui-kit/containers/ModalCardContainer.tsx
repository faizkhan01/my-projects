import { memo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { SxProps, Theme } from '@mui/material/styles';
import { Heading3, PRegular } from '../typography';

interface ModalCardContainerProps {
  children: React.ReactNode;
  title?: string;
  titleSx?: SxProps<Theme>;
  sx?: SxProps<Theme>;
  subTitle?: React.ReactNode;
  minWidth?: number | string;
  minHeight?: number | string;
  /* background?: string; */
  cardSx?: SxProps<Theme>;
  removeExtraCardPadding?: boolean;
}

export const ModalCardContainer = memo(
  ({
    children,
    title,
    titleSx,
    sx,
    minWidth = '570px',
    minHeight = '359px',
    subTitle,
    cardSx,
    removeExtraCardPadding,
  }: ModalCardContainerProps): JSX.Element => (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        ...sx,
        // height: '100%', // height: '100%' gives issues causing the scrollbar to dissapear
      }}
    >
      <Card
        sx={{
          minWidth: { xs: 'auto', sm: minWidth },
          minHeight,
          padding: {
            xs: removeExtraCardPadding
              ? '38px 24px 24px 24px'
              : '67px 24px 24px 24px',
            sm: '56px 70px',
          },
          borderRadius: '20px',
          boxShadow: 'none',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...cardSx,
        }}
      >
        {title && (
          <Box>
            <Heading3
              sx={{
                pb: '4px',
                textAlign: 'center',
                fontWeight: '600',
                ...titleSx,
              }}
            >
              {title}
            </Heading3>
            <PRegular
              sx={{
                textAlign: 'center',
              }}
            >
              {subTitle}
            </PRegular>
          </Box>
        )}
        <div className="h-full">{children}</div>
      </Card>
    </Box>
  ),
);

ModalCardContainer.displayName = 'ModalCardContainer';
