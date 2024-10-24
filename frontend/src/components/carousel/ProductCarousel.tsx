import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import useEmblaCarousel from 'embla-carousel-react';
import LightboxComponent from '@/ui-kit/LightBox';
import { Slide } from 'yet-another-react-lightbox';
import clsx from 'clsx';

export interface SlideItemT {
  url: string;
  title: string;
}

interface Props {
  slides: SlideItemT[];
}

const PreviewImages = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '.5rem',
});

const ProductCarousel: React.FC<Props> = ({ slides }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToSlide = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const [currentImage, setCurrentImage] = useState({
    src: slides?.[0]?.url,
    title: slides?.[0]?.title,
  });

  const LightBoxSlides = useMemo(() => {
    const newSlides: Slide[] = slides.map((it) => ({
      src: it.url,
      title: '',
    }));

    return newSlides;
  }, [slides]);

  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxIndex, setLightBoxIndex] = useState(0);

  return (
    <>
      <div className="flex h-[400px] gap-4 lg:gap-[30px]">
        <PreviewImages>
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-carousel-btn`}
              onClick={() => {
                setLightBoxIndex(index);
                setCurrentIndex(index);
                setCurrentImage({
                  src: slide.url,
                  title: slide.title,
                });
                goToSlide(index);
              }}
              className={clsx(
                'h-[70px] w-[70px] cursor-pointer overflow-hidden rounded-sm',
                currentIndex === index &&
                  'border-2 border-solid border-primary-main',
              )}
            >
              <Image
                className="object-cover"
                src={slide.url}
                width={70}
                height={70}
                alt={slide.title}
              />
            </div>
          ))}
        </PreviewImages>
        <div
          className="h-full max-h-[470px] overflow-hidden rounded-sm sm:w-[400px] lg:w-[470px]"
          ref={emblaRef}
        >
          <div className="flex">
            {slides.map((slide) => (
              <div className="flex-[0_0_100%]" key={slide.title}>
                <Image
                  className="cursor-pointer object-cover"
                  priority
                  src={currentImage.src}
                  width={470}
                  height={400}
                  alt={currentImage.title}
                  onClick={() => {
                    setOpenLightBox(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <LightboxComponent
        open={openLightBox}
        slides={LightBoxSlides}
        close={() => setOpenLightBox(false)}
        index={lightBoxIndex}
      />
    </>
  );
};

export default ProductCarousel;
