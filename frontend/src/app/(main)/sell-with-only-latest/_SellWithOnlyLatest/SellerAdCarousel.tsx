'use client';
import Image from 'next/image';
import routes from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TypographyProps,
  ButtonBase,
  ButtonBaseProps,
} from '@mui/material';
import { ContainedButton } from '@/ui-kit/buttons';
import useEmblaCarousel from 'embla-carousel-react';
import useProfile from '@/hooks/queries/useProfile';
import { useEffect, useState } from 'react';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';

// Images
import Slide1 from '@/assets/images/sell-with/slide1.png';
import Slide2 from '@/assets/images/sell-with/slide2.png';
import Slide3 from '@/assets/images/sell-with/slide3.png';
import Slide4 from '@/assets/images/sell-with/slide4.png';
import { CustomContainer } from '@/ui-kit/containers';

interface CarouselButtonProps extends ButtonBaseProps {
  selected: boolean;
}

const carouselData = [
  {
    id: 1,
    title: 'Your gateway to the latest and greatest creations',
    description:
      'From fashion-forward apparel to captivating artwork, from technologically advanced gadgets to eco-friendly innovations, our marketplace is your gateway to the latest and greatest creations',
    url: Slide1,
  },
  {
    id: 2,
    title:
      "We're committed to providing an immersive experience that goes beyond a simple transaction",
    description:
      'From fashion-forward apparel to captivating artwork, from technologically advanced gadgets to eco-friendly innovations, our marketplace is your gateway to the latest and greatest creations',
    url: Slide2,
  },
  {
    id: 3,
    title: 'Our unique community',
    description:
      'Our community thrives on connection and collaboration, fostering an environment where like-minded individuals can interact, support one another, and unlock endless possibilities',
    url: Slide3,
  },
  {
    id: 4,
    title: 'Support specialists',
    description:
      'With our dedicated support specialists, wealth of resources, and seamless tools, we ensure that your journey on Only Latest is filled with success and growth. ',
    url: Slide4,
  },
];

const ContentFlexibleBox = styled(Box)(({ theme }) => ({
  width: '570px',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: '34px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    gap: '30px',
  },
}));

const CarouselButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<CarouselButtonProps>(({ theme, selected }) => ({
  cursor: 'pointer',
  height: '6px',
  width: selected ? '40px' : '20px',
  borderRadius: '10px',
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.grey[500],
  transition: 'background-color .3s ease',

  ':hover': {
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.primary.dark,
    transition: 'background-color .3s ease',
  },

  [theme.breakpoints.down('sm')]: {
    height: '6px',
    width: selected ? '40px' : '20px',
  },
}));

const TitleText = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '44px',
  color: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '26px',
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '28px',
  color: '#96A2C1',

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '22px',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '440px',
  minHeight: '440px',
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minHeight: '400px',
  },
}));

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '.5rem',
});

const SellerAdCarousel = () => {
  const { profile } = useProfile();
  const { push } = useRouter();
  const openAuthModal = useAuthModalStore((state) => state.open);

  const openSignUpModal = () => {
    if (profile) {
      push(routes.SELLER_DASHBOARD.INDEX);
    }
    openAuthModal('register');
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    emblaApi?.on('select', () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="flex flex-col gap-[34px]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="grid auto-cols-[100%] grid-flow-col-dense">
          {carouselData.map((slide, index) => (
            <div key={slide.id} className="max-w-full">
              <CustomContainer className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
                <ContentFlexibleBox>
                  <div className="flex flex-col gap-3">
                    <TitleText>{slide.title}</TitleText>
                    <DescriptionText>{slide.description}</DescriptionText>
                  </div>

                  <ContainedButton
                    className="h-[60px] w-full md:h-[68px] md:w-[270px]"
                    onClick={openSignUpModal}
                  >
                    Get Started
                  </ContainedButton>
                </ContentFlexibleBox>

                <ImageContainer>
                  <Image
                    src={slide.url}
                    alt={slide.title}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </ImageContainer>
              </CustomContainer>
            </div>
          ))}
        </div>
      </div>

      <DotsContainer>
        {carouselData.map((slide, index) => (
          <CarouselButton
            key={`${slide.title}-carousel-dot`}
            onClick={() => scrollTo(index)}
            selected={currentIndex === index}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </div>
  );
};

export default SellerAdCarousel;
