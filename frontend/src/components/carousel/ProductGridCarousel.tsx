'use client';
import useCart from '@/hooks/queries/customer/useCart';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import { Product } from '@/types/products';
import {
  Button,
  ButtonBaseProps,
  Skeleton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { memo, useMemo } from 'react';
import ProductCard from '../productCard/ProductCard';
import Dot from './CarouselDot';
import useEmblaCarousel from 'embla-carousel-react';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';
import { isProductFreeShipping } from '@/utils/products';
import { createCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { useExchangeRates } from '@/hooks/queries/useExchangeRates';
import { useCarouselState } from '@/hooks/useCarouselState';

interface SlideBtnProps extends ButtonBaseProps {
  position: 'left' | 'right';
}

const SlideBtn = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'position',
})<SlideBtnProps>(({ theme, position }) => ({
  display: 'none',
  position: 'absolute',
  padding: '8px',
  top: '35%',
  transform: 'translate(0, -50%)',
  left: position === 'left' ? '-16px' : 'auto',
  right: position === 'right' ? '-16px' : 'auto',
  color: theme.palette.common.white,
  borderRadius: '2px',
  zIndex: 1,
  cursor: 'pointer',
  backgroundColor: theme.palette.primary.main,
  width: 'fit-content',
  minWidth: 'auto',

  ':hover': {
    backgroundColor: theme.palette.primary.dark,
  },

  ':disabled': {
    backgroundColor: '#dddddd',
  },

  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Slide = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingLeft: '15px',

  flex: '0 0 50%',

  [theme.breakpoints.up('sm')]: {
    flex: '0 0 33.33%',
  },

  [theme.breakpoints.up('md')]: {
    paddingLeft: '20px',
  },

  [theme.breakpoints.up('lg')]: {
    flex: '0 0 25%',
  },

  [theme.breakpoints.up('xl')]: {
    flex: '0 0 20%',
  },
}));

interface Props {
  products: Product[];
  loading?: boolean;
}

interface CustomArrowProps {
  onClick?: () => void;
}

const NextArrow = (props: CustomArrowProps) => {
  const { onClick } = props;

  return (
    <SlideBtn
      onClick={onClick}
      position="right"
      disabled={!onClick}
      aria-label="Next slide"
    >
      <CaretRight size={30} />
    </SlideBtn>
  );
};

const PrevArrow = (props: CustomArrowProps) => {
  const { onClick } = props;

  return (
    <SlideBtn
      onClick={props.onClick}
      position="left"
      disabled={!onClick}
      aria-label="Previous slide"
    >
      <CaretLeft size={30} />
    </SlideBtn>
  );
};

const ProductSlides = memo(({ products }: { products: Product[] }) => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const shippingCountry = useUserPreferencesStore(
    (state) => state.shippingCountry,
  );
  const { rates, actualCurrency: currency } = useExchangeRates();
  const converter = useMemo(
    () => createCurrencyConverter(rates || {}),
    [rates],
  );

  return (
    <>
      {products.map((item) => {
        const isWish = Boolean(wishlist[item.id]);
        const isCart = Boolean(cart[item.id]);
        const rate = converter(1, { from: item.currency, to: currency });

        return (
          <Slide key={item.id}>
            <ProductCard
              product={item}
              isCart={isCart}
              isWish={isWish}
              isFreeShipping={isProductFreeShipping(shippingCountry, item)}
              currency={currency ?? 'USD'}
              exchangeRate={rate}
            />
          </Slide>
        );
      })}
    </>
  );
});

ProductSlides.displayName = 'Productlides';

export const ProductGridCarousel = ({ products, loading = false }: Props) => {
  const theme = useTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 'auto',
    align: 'start',
    breakpoints: {
      [`(min-width: ${theme.breakpoints.values.md}px)`]: {
        draggable: false,
      },
    },
  });

  const {
    state: carouselState,
    goToNext,
    goToSlide,
    goToPrevious,
  } = useCarouselState(emblaApi);

  const matchLg = useMediaQuery(theme.breakpoints.down('lg'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));

  const slidesValueRef = useMemo(() => {
    if (matchSm) {
      return 2;
    } else if (matchMd) {
      return 3;
    } else if (matchLg) {
      return 4;
    } else {
      return 5;
    }
  }, [matchLg, matchMd, matchSm]);

  const loadingBoxes = slidesValueRef;
  const emptyBoxes =
    products?.length < slidesValueRef ? slidesValueRef - products?.length : 0;

  return (
    <div className="relative">
      <PrevArrow
        onClick={carouselState.prevEnabled ? goToPrevious : undefined}
      />
      <NextArrow onClick={carouselState.nextEnabled ? goToNext : undefined} />
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="ml-[calc(15px*-1)] flex md:ml-[calc(20px*-1)]">
          {loading &&
            new Array(loadingBoxes).fill(undefined).map((_, index) => (
              <Slide key={index + 'loading'}>
                <Skeleton variant="rounded" height={400} />
              </Slide>
            ))}
          {!loading && <ProductSlides products={products} />}
          {new Array(emptyBoxes).fill(undefined).map((_, index) => (
            <Slide key={index}></Slide>
          ))}
        </div>
      </div>

      <div className="mt-6 flex min-h-[10px] justify-center gap-2 sm:hidden">
        {carouselState.scrollSnaps.map((_, index) => {
          return (
            <Dot
              key={`${index}-carousel-dot`}
              aria-label={`Go to slide ${index}`}
              selected={index === carouselState.currentIndex}
              onClick={() => goToSlide(index)}
            />
          );
        })}
      </div>
    </div>
  );
};
