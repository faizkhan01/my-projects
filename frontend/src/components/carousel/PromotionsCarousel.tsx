'use client';
import { Promotion } from '@/types/promotion';
import { Box, ButtonBase, ButtonBaseProps } from '@mui/material';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Dot from './CarouselDot';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import routes from '@/constants/routes';

interface PromotionsCarouselProps {
  promotions: Promotion[];
}

interface SlideBtnProps extends ButtonBaseProps {
  position: 'left' | 'right';
}

const Slide = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '200px',
  flex: '0 0 100%',

  [theme.breakpoints.up('sm')]: {
    height: '460px',
  },
})) as typeof Box;

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1.5rem',
  gap: '.5rem',
});

const SlideBtn = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'position',
})<SlideBtnProps>(({ theme, position }) => ({
  display: 'none',
  position: 'absolute',
  padding: '8px',
  top: '50%',
  transform: 'translate(0, -50%)',
  left: position === 'left' ? '24px' : 'auto',
  right: position === 'right' ? '24px' : 'auto',
  color: theme.palette.common.white,
  borderRadius: '2px',
  zIndex: 1,
  cursor: 'pointer',
  backgroundColor: theme.palette.grey[800],

  ':hover': {
    backgroundColor: theme.palette.grey[900],
  },

  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

const PromotionsCarousel = ({ promotions }: PromotionsCarouselProps) => {
  const theme = useTheme();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      breakpoints: {
        [`(min-width: ${theme.breakpoints.values.md}px)`]: {
          draggable: false,
        },
      },
    },
    [
      Autoplay({
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToPrevious = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const goToNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const goToSlide = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    emblaApi?.on('select', () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <Box style={{ position: 'relative', height: '100%' }}>
      <SlideBtn
        onClick={() => goToPrevious()}
        position="left"
        aria-label="Go to previous slide"
      >
        <CaretLeft size={24} />
      </SlideBtn>
      <SlideBtn
        onClick={() => goToNext()}
        position="right"
        aria-label="Go to next slide"
      >
        <CaretRight size={24} />
      </SlideBtn>

      <Box
        sx={{
          overflow: 'hidden',
          borderRadius: '10px',
        }}
        ref={emblaRef}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {promotions
            .filter((p) => p.banner)
            .map((promotion, index) => (
              <Link
                key={`${promotion.title}-carousel-slide`}
                passHref
                legacyBehavior
                href={routes.PROMOTIONS.INFO(promotion.slug, promotion.id)}
              >
                <Slide component="a">
                  <Image
                    src={promotion.banner.url}
                    fill
                    alt={promotion.title}
                    style={{
                      objectFit: 'cover',
                    }}
                    priority={index === 0}
                  />
                </Slide>
              </Link>
            ))}
        </Box>
      </Box>

      <DotsContainer>
        {promotions.map((slide, index) => (
          <Dot
            key={`${slide.title}-carousel-dot`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            selected={currentIndex === index}
          />
        ))}
      </DotsContainer>
    </Box>
  );
};

export default PromotionsCarousel;
