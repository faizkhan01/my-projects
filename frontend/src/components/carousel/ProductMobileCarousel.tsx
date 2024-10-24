import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Dot from './CarouselDot';
import useEmblaCarousel from 'embla-carousel-react';
import { SlideItemT } from './ProductCarousel';

interface Props {
  slides: SlideItemT[];
}

const Slide = styled('li')(() => ({
  position: 'relative',
  height: '375px',
  flex: '0 0 100%',
  width: '100%',
}));

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1.5rem',
  gap: '.5rem',
});

const ProductMobileCarousel: React.FC<Props> = ({ slides }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const goToSlide = (index: number) => emblaApi?.scrollTo(index);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi?.on('select', () => {
      onSelect();
    });
    emblaApi?.on('reInit', () => {
      onSelect();
    });
  }, [emblaApi, onSelect]);

  return (
    <Box
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
        }}
        ref={emblaRef}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {slides.map((slide) => (
            <Slide key={`${slide.title}-carousel-slide`}>
              <Image
                src={slide.url}
                fill
                style={{
                  objectFit: 'cover',
                }}
                alt={slide.title}
                priority
              />
            </Slide>
          ))}
        </Box>
      </Box>

      <DotsContainer>
        {slides.map((slide, index) => (
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

export default ProductMobileCarousel;
