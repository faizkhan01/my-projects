'use client';
import { EmblaCarouselType } from 'embla-carousel-react';
import { useEffect, useState } from 'react';

export const useCarouselState = (emblaApi: EmblaCarouselType | undefined) => {
  const [carouselState, setCarouselState] = useState<{
    currentIndex: number;
    scrollSnaps: number[];
    prevEnabled: boolean;
    nextEnabled: boolean;
  }>({
    currentIndex: 0,
    scrollSnaps: [],
    prevEnabled: false,
    nextEnabled: false,
  });

  const onSelect = (emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;

    setCarouselState((old) => ({
      ...old,
      prevEnabled: emblaApi.canScrollPrev(),
      nextEnabled: emblaApi.canScrollNext(),
      currentIndex: emblaApi.selectedScrollSnap(),
    }));
  };
  const onInit = (emblaApi: EmblaCarouselType) => {
    setCarouselState((old) => ({
      ...old,
      scrollSnaps: emblaApi.scrollSnapList(),
    }));
  };

  const goToPrevious = () => emblaApi?.scrollPrev();

  const goToNext = () => emblaApi?.scrollNext();

  const goToSlide = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', () => onInit(emblaApi));
    emblaApi.on('reInit', () => onSelect(emblaApi));
    emblaApi.on('select', () => onSelect(emblaApi));
  }, [emblaApi]);

  return {
    state: carouselState,
    goToPrevious,
    goToNext,
    goToSlide,
  };
};
