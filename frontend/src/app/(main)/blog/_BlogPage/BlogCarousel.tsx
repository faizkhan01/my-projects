'use client';
import ArticleCard from '@/components/blog/ArticleCard';
import CarouselDot from '@/components/carousel/CarouselDot';
import { useCarouselState } from '@/hooks/useCarouselState';
import { BlogPost } from '@/types/blog';
import useEmblaCarousel from 'embla-carousel-react';

const BlogCarousel = ({ posts }: { posts: BlogPost[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
  });

  const { state: carouselState, goToSlide } = useCarouselState(emblaApi);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {posts.map((p) => (
            <div
              className="min-w-0 flex-[0_0_70%] pl-4"
              key={`${p.id}-carousel-slide`}
            >
              <ArticleCard post={p} variant="card" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {carouselState.scrollSnaps.map((_, index) => (
          <CarouselDot
            key={`carousel-dot-${index}`}
            selected={carouselState.currentIndex === index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogCarousel;
