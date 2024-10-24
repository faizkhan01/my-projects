'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/icons/Logo';
import routes from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { HotSale } from '@/assets/icons/HotSale';
import { ContainedButton } from '@/ui-kit/buttons';
import useProfile from '@/hooks/queries/useProfile';
import { Typography, Grid, TypographyProps } from '@mui/material';
import { CustomContainer } from '@/ui-kit/containers';
import { MobilePayment } from '@/assets/icons/MobilePayment';
import { ShoppingBasket } from '@/assets/icons/ShoppingBasket';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import { UserCirclePlus } from '@/assets/icons/UserCirclePlus';
import { CurrencyCircleDollar } from '@/assets/icons/CurrencyCircleDollar';
import { CurvedLine } from '@/assets/icons/CurvedLine';
import SellerAdCarousel from './SellerAdCarousel';

// Images
import HeroImg from '@/assets/images/sell-with/hero.png';
import Card1 from '@/assets/images/sell-with/card01.png';
import Card2 from '@/assets/images/sell-with/card02.png';
import Card3 from '@/assets/images/sell-with/card03.png';
import Card4 from '@/assets/images/sell-with/card04.png';
import UserImg1 from '@/assets/images/sell-with/Image1.png';
import UserImg2 from '@/assets/images/sell-with/Image2.png';
import UserImg3 from '@/assets/images/sell-with/Image3.png';
import UserImg4 from '@/assets/images/sell-with/Image4.png';
import UserImg5 from '@/assets/images/sell-with/Image5.png';
import ProductCardImg from '@/assets/images/sell-with/productCard.png';
import SmallCardImg1 from '@/assets/images/sell-with/smallCard01.png';
import SmallCardImg2 from '@/assets/images/sell-with/smallCard02.png';

const cardData = [
  {
    id: 1,
    title: 'Become part of a community',
    imageSrc: Card1,
    imageAlt: 'Women using a laptop',
    content:
      'Join us at Only Latest and unleash your creativity, be inspired by extraordinary talent, and become part of a vibrant community that celebrates innovation',
  },
  {
    id: 2,
    title: 'A world without borders',
    imageSrc: Card2,
    imageAlt: 'Person preparing their package',
    content:
      "Whether you're a seller ready to showcase your latest masterpiece or a shopper seeking the next big trend, Only Latest welcomes you to a world where creativity knows no bounds",
  },
  {
    id: 3,
    title: 'The latest trends',
    imageSrc: Card3,
    imageAlt: 'Woman looking for clothes',
    content:
      'Get ready to explore, connect, and experience the excitement of being on the cutting edge of the latest trends',
  },
  {
    id: 4,
    title: 'Convenience & quality & creativity',
    imageSrc: Card4,
    imageAlt: 'Woman buying products online',
    content:
      'Join us at Only Latest and unleash your creativity, be inspired by extraordinary talent, and become part of a vibrant community that celebrates innovation',
  },
];

const iconData = [
  {
    id: 1,
    icon: ShoppingBasket,
    title: 'Exceptional products',
  },
  {
    id: 2,
    icon: MobilePayment,
    title: 'Cutting-edge designs',
  },
  {
    id: 3,
    icon: HotSale,
    title: 'The latest trends',
  },
];

const userImg = [
  {
    id: 1,
    imageSrc: UserImg1,
  },
  {
    id: 2,
    imageSrc: UserImg2,
  },
  {
    id: 3,
    imageSrc: UserImg3,
  },
  {
    id: 4,
    imageSrc: UserImg4,
  },
  {
    id: 5,
    imageSrc: UserImg5,
  },
];

const NavbarContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '32px 0px 50px 0px',

  [theme.breakpoints.down('sm')]: {
    margin: '20px 0px 30px 0px',
  },
}));

const HeroBox = styled('div')(({ theme }) => ({
  padding: '0px 0px 112px 0px',
  backgroundColor: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    padding: '30px 0px 60px 0px',
  },
}));

const HeroSection = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '60px',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.common.white,

  [theme.breakpoints.down('xs')]: {
    gap: '30px',
    flexDirection: 'column',
  },

  [theme.breakpoints.down('md')]: {
    gap: '30px',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
}));

const Heading = styled((props: TypographyProps<'h1'>) => (
  <Typography component="h1" {...props} />
))<TypographyProps<'h1'>>(({ theme }) => ({
  fontSize: '60px',
  fontWeight: 600,
  lineHeight: '64px',
  textAlign: 'start',
  color: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
    lineHeight: '38px',
    textAlign: 'center',
  },
}));

const HeadingParagraph = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 400,
  lineHeight: '28px',
  textAlign: 'start',
  color: '#96A2C1',

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '26px',
    textAlign: 'center',
  },
}));

const HeroContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '60px',

  [theme.breakpoints.up('md')]: {
    width: '530px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    gap: '24px',
  },
}));

const HeroCardBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '14px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },

  [theme.breakpoints.down('sm')]: {
    gap: '8px',
  },
}));

const HeroImageContainer = styled('div')(({ theme }) => ({
  height: '310px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',
  width: '100%',
  // backgroundImage: `url(https://i.ibb.co/PGL9QFW/hero.png)`,
  // backgroundPosition: 'center',
  // backgroundRepeat: 'no-repeat',

  [theme.breakpoints.up('md')]: {
    maxWidth: '570px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'none',
    height: '190px',
  },
}));

const BlueBorderBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '53px',
  justifyContent: 'center',
  padding: '12px 16px 11px 16px',
  border: `2px solid ${theme.palette.primary.main}`,

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '7px 9px 6px 9px',
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const WhiteBorderBox = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '53px',
  justifyContent: 'center',
  padding: '12px 16px 11px 16px',
  border: `2px solid ${theme.palette.common.white}`,

  [theme.breakpoints.down('sm')]: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'start',
    padding: '7px 9px 6px 9px',
    border: `1px solid ${theme.palette.common.white}`,
  },
}));

const WhiteBorderBoxText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '28px',
  color: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '22px',
  },
}));

const WhiteTitleText = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '28px',
  color: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    lineHeight: '22px',
  },
}));

const WhiteSubTitleText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '28px',
  color: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    fontSize: '8px',
    fontWeight: 400,
    lineHeight: '22px',
  },
}));

const UserImageContainer = styled('div')(({ theme }) => ({
  width: '48px',
  height: '48px',
  position: 'relative',
  borderRadius: '50%',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    height: '29px',
    width: '29px',
  },
}));

const BlueBorderBoxText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '28px',
  color: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '22px',
  },
}));

const SmallDarkBox = styled('div')(({ theme }) => ({
  width: '190px',
  height: 'inherit',
  padding: '24px',
  borderRadius: '10px',
  position: 'relative',
  backgroundColor: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    padding: '14px',
    minWidth: '114px',
    width: 'auto',
  },
}));

const CurvedLineBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '55px',
  left: '70px',

  [theme.breakpoints.down('sm')]: {
    top: '35px',
    left: '45px',
    '& svg': {
      width: '39px',
      height: '58px',
    },
  },
}));

const UserCurrencyBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '110px',
  left: '106px',

  [theme.breakpoints.down('sm')]: {
    top: '65px',
    left: '65px',
  },
}));

const SmallDarkTextBox = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  position: 'absolute',
  bottom: '0',
  left: 0,
  padding: 'inherit',
  paddingTop: 0,
  paddingRight: 0,
  width: '100%',
  display: 'flex',
  fontSize: '24px',
  fontWeight: 600,
  color: 'white',

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    paddingRight: 'inherit',
  },
}));

const SmallBlueBox = styled('div')(({ theme }) => ({
  gap: '24px',
  padding: '24px',
  borderRadius: '10px',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.primary.main,
  flex: 1,

  [theme.breakpoints.up('md')]: {
    maxWidth: '366px',
  },

  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    padding: '14px',
    maxWidth: 'none',
  },
}));

const ProductImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '500px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    order: 1,
    minHeight: '340px',
  },
}));

const ProductFlexibleBox = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '150px',
  borderRadius: '10px',

  [theme.breakpoints.down('xs')]: {
    gap: '30px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'column-reverse',
  },

  [theme.breakpoints.down('lg')]: {
    gap: '60px',
  },

  [theme.breakpoints.down('md')]: {
    gap: '30px',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const ProductCardContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '34px',

  [theme.breakpoints.down('sm')]: {
    gap: '24px',
  },
}));

const ProductSubHeading = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '44px',
  fontWeight: 600,
  lineHeight: '44px',
  color: theme.palette.primary.contrastText,

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    fontSize: '28px',
    lineHeight: '32px',
  },
}));

const BlueCard = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '440px',
  height: '100%',
  padding: '34px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '16px 16px 24px 16px',
  },
}));

const BlackCard = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '440px',
  padding: '34px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  borderRadius: '10px',
  backgroundColor: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minHeight: '100%',
    padding: '16px 16px 24px 16px',
  },
}));

const SmallImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '240px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minHeight: '240px',
  },
}));

const SmallCardContent = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
}));

const SubHeading = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '44px',
  fontWeight: 600,
  lineHeight: '40px',
  textAlign: 'center',
  color: theme.palette.primary.contrastText,

  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    lineHeight: '32px',
  },
}));

const BlackSubHeading = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps<'h2'>>(({ theme }) => ({
  fontSize: '44px',
  fontWeight: 600,
  lineHeight: '44px',
  textAlign: 'center',
  color: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    lineHeight: '32px',
  },
}));

const BlueText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const DarkSection = styled('section')(({ theme }) => ({
  padding: '112px 0px',
  backgroundColor: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    padding: '60px 0px',
  },
}));

const WhiteSection = styled('section')(({ theme }) => ({
  padding: '112px 0px',
  backgroundColor: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    padding: '60px 0px',
  },
}));

const FlexibleBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',

  [theme.breakpoints.down('sm')]: {
    gap: '12px',
  },
}));

const IconBox = styled('div')(({ theme }) => ({
  height: '60px',
  width: '60px',
  fontSize: '28px',
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '50%',
  alignItems: 'center',
  '& svg': { width: '28px' },
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    height: '40px',
    width: '40px',
    fontSize: '18px',
    '& svg': { width: '18px' },
  },
}));

const FlexibleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '34px',

  [theme.breakpoints.down('sm')]: {
    gap: '24px',
  },
}));

const IconFlexibleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '60px',

  [theme.breakpoints.down('sm')]: {
    gap: '30px',
  },
}));

const CardBox = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '10px',
  backgroundColor: '#272D3F',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
  },
}));

const CardImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '280px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px 10px 0px 0px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minHeight: '280px',
  },
}));

const CardContent = styled('div')(() => ({
  display: 'flex',
  padding: '24px 34px 34px 34px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  alignSelf: 'stretch',
}));

const CardTitle = styled((props: TypographyProps<'h3'>) => (
  <Typography component="h3" {...props} />
))<TypographyProps<'h3'>>(({ theme }) => ({
  fontSize: '25px',
  fontWeight: 600,
  lineHeight: '40px',
  color: theme.palette.common.white,

  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '26px',
  },
}));

const Paragraph = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 200,
  lineHeight: '24px',
  color: theme.palette.primary.contrastText,

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    fontWeight: 200,
    lineHeight: '24px',
  },
}));

const BlackParagraph = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '24px',
  textAlign: 'center',
  color: theme.palette.grey[800],

  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    lineHeight: '24px',
  },
}));

const BlueBorderBoxStyle = {
  top: {
    xs: '12px',
    md: '20px',
    sm: '20px',
  },
  left: {
    xs: '12px',
    md: '20px',
    sm: '20px',
  },
};

const BlueBorderBoxTextStyle = {
  top: {
    xs: '50px',
    md: '80px',
    sm: '80px',
  },
  left: {
    xs: '50px',
    md: '80px',
    sm: '80px',
  },
};

const SellWithOnlyLatest = () => {
  const { profile } = useProfile();
  const { push } = useRouter();
  const openAuthModal = useAuthModalStore((state) => state.open);

  const openSignUpModal = () => {
    if (profile) {
      return push(routes.SELLER_DASHBOARD.INDEX);
    }

    openAuthModal('register');
  };
  return (
    <div>
      <CustomContainer>
        <NavbarContainer>
          <Link href="/" aria-label="Go Home">
            <Logo variant="original" height={24} width={144} />
          </Link>
          <ContainedButton
            onClick={() =>
              !profile && useAuthModalStore.getState().open('login')
            }
            className="h-[35px] w-[92px] sm:h-[40px] sm:w-[170px]"
            href={profile ? routes.DASHBOARD.INDEX : undefined}
          >
            Sign In
          </ContainedButton>
        </NavbarContainer>
      </CustomContainer>
      <HeroBox>
        <CustomContainer>
          <HeroSection>
            <HeroContent>
              <div className="flex flex-col gap-3">
                <Heading>
                  Welcome to <BlueText>Only Latest,</BlueText> the premier
                  online marketplace
                </Heading>
                <HeadingParagraph>
                  A place where innovation meets style and shopping becomes an
                  extraordinary journey
                </HeadingParagraph>
              </div>
              <ContainedButton
                className="h-[60px] w-full md:h-[68px] md:w-[270px]"
                onClick={openSignUpModal}
              >
                Get Started
              </ContainedButton>
            </HeroContent>
            <HeroCardBox>
              <HeroImageContainer>
                <Image
                  src={HeroImg}
                  fill
                  className="object-cover"
                  alt="woman buying a product online"
                />

                <BlueBorderBox sx={BlueBorderBoxStyle}>
                  <BlueBorderBoxText>shopping</BlueBorderBoxText>
                </BlueBorderBox>
                <BlueBorderBox sx={BlueBorderBoxTextStyle}>
                  <BlueBorderBoxText>innovations</BlueBorderBoxText>
                </BlueBorderBox>
              </HeroImageContainer>

              <div className="flex w-full gap-2 md:gap-3.5">
                <SmallDarkBox>
                  <IconBox>
                    <UserCirclePlus />
                  </IconBox>
                  <CurvedLineBox>
                    <CurvedLine />
                  </CurvedLineBox>
                  <UserCurrencyBox>
                    <IconBox>
                      <CurrencyCircleDollar />
                    </IconBox>
                  </UserCurrencyBox>
                  <SmallDarkTextBox>
                    join us <br />& get money
                  </SmallDarkTextBox>
                </SmallDarkBox>

                <SmallBlueBox>
                  <WhiteBorderBox>
                    <WhiteBorderBoxText>
                      extraordinary journey
                    </WhiteBorderBoxText>
                  </WhiteBorderBox>
                  <div>
                    <WhiteTitleText>40k happy customers</WhiteTitleText>
                    <WhiteSubTitleText>
                      Our online platform attracts more and more users{' '}
                    </WhiteSubTitleText>
                  </div>

                  <div className="flex">
                    {userImg.map(({ imageSrc, id }, index) => (
                      <UserImageContainer
                        key={id}
                        className={index > 0 ? '-ml-3' : ''}
                      >
                        <Image
                          src={imageSrc}
                          alt={`user_${id}`}
                          className="object-cover"
                          fill
                        />
                      </UserImageContainer>
                    ))}
                  </div>
                </SmallBlueBox>
              </div>
            </HeroCardBox>
          </HeroSection>
        </CustomContainer>
      </HeroBox>
      <DarkSection>
        <CustomContainer>
          <ProductFlexibleBox>
            <ProductImageContainer>
              <Image
                src={ProductCardImg}
                alt="product_image"
                fill
                className="object-cover"
              />
            </ProductImageContainer>
            <ProductCardContent>
              <ProductSubHeading>
                <BlueText>Only Latest</BlueText> is the ultimate destination for
                online shopping
              </ProductSubHeading>
              <Paragraph className="text-[#96A2C1]">
                Only Latest is bringing together a diverse range of top-quality
                products from reputable sellers all in one place. We invite you
                to embark on a captivating journey through a vibrant and
                ever-evolving world of creative entrepreneurship
              </Paragraph>
              <ContainedButton
                className="h-[60px] w-full md:h-[68px] md:w-[270px]"
                onClick={openSignUpModal}
              >
                Get Started
              </ContainedButton>
            </ProductCardContent>
          </ProductFlexibleBox>
        </CustomContainer>
      </DarkSection>
      <WhiteSection>
        <CustomContainer>
          <FlexibleContainer>
            <BlackSubHeading>
              <BlueText>Our marketplace</BlueText> is a vibrant melting pot of
              creators, <br /> artisans, and entrepreneurs who bring their
              passions <br /> to life through their offerings
            </BlackSubHeading>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <BlueCard>
                  <SmallImageContainer>
                    <Image
                      src={SmallCardImg1}
                      alt="woman measuring cloth"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </SmallImageContainer>
                  <SmallCardContent>
                    <CardTitle>Only Latest for designers</CardTitle>
                    <Paragraph>
                      Only Latest: Showcasing visionary art, skilled
                      craftsmanship, and innovative design your perfect platform
                      for creations.
                    </Paragraph>
                  </SmallCardContent>
                </BlueCard>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <BlackCard>
                  <SmallImageContainer>
                    <Image
                      src={SmallCardImg2}
                      alt="two women using a laptop"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </SmallImageContainer>
                  <SmallCardContent>
                    <CardTitle>Only Latest for shoppers</CardTitle>
                    <Paragraph>
                      For shoppers, Only Latest is a treasure trove of
                      inspiration, where you can explore a diverse range of
                      products that push boundaries and redefine trends.
                    </Paragraph>
                  </SmallCardContent>
                </BlackCard>
              </Grid>
            </Grid>
          </FlexibleContainer>
        </CustomContainer>
      </WhiteSection>
      <DarkSection className="flex flex-col gap-[34px]">
        <CustomContainer>
          <SubHeading>
            What you will find on <BlueText>our marketplace</BlueText>
          </SubHeading>
        </CustomContainer>
        <SellerAdCarousel />
      </DarkSection>
      <WhiteSection>
        <CustomContainer>
          <IconFlexibleContainer>
            <BlackSubHeading>
              As a <BlueText>seller or shopper</BlueText>, you&apos;ll discover
              a haven of
            </BlackSubHeading>
            <Grid container spacing={3}>
              {iconData.map(({ icon: Icon, title, id }) => (
                <Grid item xs={12} sm={4} md={4} lg={4} key={id}>
                  <FlexibleBox>
                    <IconBox>
                      <Icon />
                    </IconBox>
                    <BlackParagraph>{title}</BlackParagraph>
                  </FlexibleBox>
                </Grid>
              ))}
            </Grid>
          </IconFlexibleContainer>
        </CustomContainer>
      </WhiteSection>
      <DarkSection>
        <CustomContainer>
          <FlexibleContainer>
            <SubHeading>
              Join us at <BlueText>Only Latest </BlueText>
            </SubHeading>
            <Grid container spacing={4}>
              {cardData.map((card) => (
                <Grid
                  item
                  xs={12}
                  md={card.id === 2 || card.id === 3 ? 6 : 12}
                  lg={card.id === 2 || card.id === 3 ? 7 : 5}
                  key={card.id}
                >
                  <CardBox>
                    <CardImageContainer>
                      <Image
                        src={card.imageSrc}
                        alt={card.imageAlt}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </CardImageContainer>
                    <CardContent>
                      <CardTitle>{card.title}</CardTitle>
                      <Paragraph className="text-[#96A2C1]">
                        {card.content}
                      </Paragraph>
                    </CardContent>
                  </CardBox>
                </Grid>
              ))}
            </Grid>
            <ContainedButton
              className="h-[60px] w-full md:h-[68px] md:w-[270px]"
              onClick={openSignUpModal}
            >
              Get Started
            </ContainedButton>
          </FlexibleContainer>
        </CustomContainer>
      </DarkSection>
    </div>
  );
};

export default SellWithOnlyLatest;
