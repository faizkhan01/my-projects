'use client';

import Image from 'next/image';
import useProfile from '@/hooks/queries/useProfile';
import { useSocketStore } from '@/hooks/stores/useSocketStore';
import {
  useActualCurrency,
  useUserPreferencesStore,
} from '@/hooks/stores/useUserPreferencesStore';
import { Product } from '@/types/products';
import { Store } from '@/types/stores';
import { OutlinedButton, ContainedButton } from '@/ui-kit/buttons';
import { formatPrice } from '@/utils/currency';
import { getProductShipsTo } from '@/utils/products';
import { Accordion } from '@/ui-kit/accordions';
import {
  CaretDown,
  Package,
  Truck,
  CheckCircle,
  SealCheck,
  Icon,
  CaretRight,
} from '@phosphor-icons/react';
import { useState, useMemo, memo } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Typography, Link } from '@mui/material';
import { useCurrencyConverter } from '@/hooks/stores/useCurrencyConverterStore';
import { useFollowingStoreActions } from '@/hooks/following/useFollowingStoreActions';
import NextLink from 'next/link';
import routes from '@/constants/routes';

const productPageAccordion = [
  // 'Item details',
  'Description',
  'Delivery and return policies',
  'Contact seller',
] as const;

const getDeliveryDate = (minDays?: number, maxDays?: number): string => {
  const format = 'MMM D';

  if (maxDays && minDays) {
    const minDate = dayjs().add(minDays, 'day');
    const maxDate = dayjs().add(maxDays, 'day');

    if (minDate.month() === maxDate.month()) {
      return `${minDate.format(format)} - ${maxDate.format('D')}`;
    }

    return `${minDate.format(format)} - ${maxDate.format(format)}`;
  }

  return dayjs().format(format);
};

const ShippingAndDeliverySectionTitle = styled(Typography)(() => ({
  color: '#96A2C1',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '16px',
}));

const ShippingAndDeliverySectionSubTitle = styled(Typography)(() => ({
  color: '#333E5C',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
}));

const ContactSeller = ({ store }: { store: Store }) => {
  const [loading, setLoading] = useState(false);

  const createChat = useSocketStore((state) => state.createChat);

  const {
    onFollow,
    isFollowing,
    isLoading: isLoadingFollowing,
    isSeller,
    onUnfollow,
  } = useFollowingStoreActions(store);

  const { profile } = useProfile();

  const isOwnStore = profile?.store?.name === store.name;

  const handleContact = () => {
    createChat({ storeId: store.id });
    setLoading(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        {store?.logo?.url && (
          <NextLink href={routes.STORES.INFO(store.slug)}>
            <Image
              className="rounded-full"
              src={store?.logo?.url}
              height={60}
              width={60}
              alt={store.name}
            />
          </NextLink>
        )}
        <div>
          <NextLink
            href={routes.STORES.INFO(store.slug)}
            passHref
            legacyBehavior
          >
            <Link
              sx={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '24px',
                mb: '4px',
              }}
              color="inherit"
              underline="none"
            >
              {store.name}
            </Link>
          </NextLink>
          <div className="mt-[5px] flex items-center gap-2 text-primary-main">
            <SealCheck size={20} weight={store?.verified ? 'fill' : 'light'} />
            <Typography
              sx={{
                fontSize: '16px',
              }}
            >
              {store?.verified ? 'Verified' : 'Not Verfied'}
            </Typography>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {isFollowing ? (
          <OutlinedButton onClick={() => onUnfollow()} fullWidth>
            Unfollow
          </OutlinedButton>
        ) : (
          <ContainedButton
            loading={isLoadingFollowing}
            onClick={() => onFollow()}
            disabled={isSeller}
            fullWidth
          >
            Follow
          </ContainedButton>
        )}
        <OutlinedButton
          onClick={handleContact}
          disabled={loading || !profile || isOwnStore}
        >
          Contact Seller
        </OutlinedButton>
      </div>
    </div>
  );
};

const MemoContactSeller = memo(ContactSeller);

const EstimatedDeliveryCard = ({
  title,
  isLast,
  date,
  icon: Icon,
}: {
  title: string;
  date: string;
  isLast?: boolean;
  icon: Icon;
}) => {
  return (
    <>
      <div
        className={`relative flex flex-1 items-center gap-3 md:flex-col md:gap-4 md:py-5 ${
          !isLast && 'md:border-r md:border-solid md:border-[#EAECF4]'
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-[100px] bg-white md:h-10 md:w-10">
          <span className="flex md:hidden">
            <Icon size={16} />
          </span>
          <span className="hidden md:flex">
            <Icon size={20} />
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between gap-1 md:flex-col">
          <Typography
            sx={{
              color: '#333E5C',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: '500',
              order: {
                xs: 2,
                md: 0,
              },
              lineHeight: { xs: '16px', md: '18px' },
            }}
          >
            {date}
          </Typography>
          <div className="order-1 h-full flex-1 self-end border-t border-dashed border-[#EAECF4] pb-1 md:hidden"></div>
          <Typography
            sx={{
              color: '#96A2C1',
              order: {
                xs: 0,
                md: 2,
              },
              fontSize: { xs: '14px', md: '12px' },
              fontWeight: '400',
              lineHeight: '16px',
            }}
          >
            {title}
          </Typography>
        </div>
        {!isLast && (
          <div className=" absolute inset-y-0 right-[calc(0%-10px)] z-10 mx-0 my-auto hidden h-6 w-6 items-center justify-center gap-2.5 rounded-full border border-[#EAECF4] bg-[#F6F9FF] md:inline-flex">
            <CaretRight size={12} />
          </div>
        )}
      </div>

      {!isLast && (
        <div className="flex h-4 items-center py-2 pl-4 md:hidden">
          <div className="h-2 w-px rounded-sm bg-[#EAECF4]"></div>
        </div>
      )}
    </>
  );
};

export const ProductInfoAccrodion = ({
  product,
  store,
}: {
  product: Product;
  store: Store;
}) => {
  const prefShippingCountry = useUserPreferencesStore((s) => s.shippingCountry);
  const actualCurrency = useActualCurrency();
  const converter = useCurrencyConverter();

  const shippingAvailable = useMemo(
    () => getProductShipsTo(prefShippingCountry, product),
    [prefShippingCountry, product],
  );

  return (
    <div>
      <Accordion type="single" defaultValue={'Description'}>
        {productPageAccordion.map((item, index) => {
          return (
            <Accordion.Item key={index} value={item}>
              <Accordion.Summary
                expandIcon={<CaretDown size={16} color="#96A2C1" />}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '140%',
                  }}
                >
                  {item}
                </Typography>
              </Accordion.Summary>
              <Accordion.Details>
                {item === 'Description' && (
                  <Typography className="whitespace-pre-line text-sm leading-6 md:text-base">
                    {product.description}
                  </Typography>
                )}
                {item === 'Delivery and return policies' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <ShippingAndDeliverySectionTitle>
                        Estimated arrival
                      </ShippingAndDeliverySectionTitle>
                      {shippingAvailable && (
                        <div className="flex flex-col bg-[#F6F9FF] p-4 md:flex-row md:p-0">
                          <EstimatedDeliveryCard
                            title={'Order placed'}
                            icon={Package}
                            date={getDeliveryDate()}
                          />
                          <EstimatedDeliveryCard
                            title={'Order ships'}
                            icon={Truck}
                            date={getDeliveryDate(
                              shippingAvailable?.minProcessingDays,
                              shippingAvailable?.maxProcessingDays,
                            )}
                          />
                          <EstimatedDeliveryCard
                            isLast
                            title={'Delivered!'}
                            icon={CheckCircle}
                            date={getDeliveryDate(
                              shippingAvailable?.minExpectedDays,
                              shippingAvailable?.maxExpectedDays,
                            )}
                          />
                        </div>
                      )}

                      {!shippingAvailable && prefShippingCountry && (
                        <ShippingAndDeliverySectionSubTitle>
                          This item doesn&apos;t ship to {prefShippingCountry}
                        </ShippingAndDeliverySectionSubTitle>
                      )}

                      {!shippingAvailable && !prefShippingCountry && (
                        <ShippingAndDeliverySectionSubTitle>
                          This item doesn&apos;t ship to your location
                        </ShippingAndDeliverySectionSubTitle>
                      )}
                    </div>
                    {shippingAvailable && (
                      <div className="flex flex-col gap-2">
                        <ShippingAndDeliverySectionTitle>
                          Cost to ship
                        </ShippingAndDeliverySectionTitle>
                        <ShippingAndDeliverySectionSubTitle>
                          {shippingAvailable?.price === 0 && 'Free'}
                          {!!shippingAvailable?.price &&
                            shippingAvailable?.price > 0 &&
                            formatPrice(
                              converter(shippingAvailable?.price, {
                                from: product.currency ?? null,
                                to: actualCurrency ?? null,
                              }),
                              {
                                currency: actualCurrency,
                              },
                            )}
                        </ShippingAndDeliverySectionSubTitle>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <ShippingAndDeliverySectionTitle>
                        Returns & exchanges
                      </ShippingAndDeliverySectionTitle>
                      <ShippingAndDeliverySectionSubTitle>
                        Contact me if you have problems with your order
                      </ShippingAndDeliverySectionSubTitle>
                    </div>
                  </div>
                )}
                {item == 'Contact seller' && (
                  <MemoContactSeller store={store} />
                )}
              </Accordion.Details>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};
