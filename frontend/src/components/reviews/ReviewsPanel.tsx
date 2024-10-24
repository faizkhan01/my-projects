import NextImage from 'next/image';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useRouteReplace } from '@/hooks/queries/useRouteReplace';
import { Product } from '@/types/products';
import {
  Box,
  Typography,
  Skeleton,
  Grid,
  Divider,
  ButtonBase,
  Button,
} from '@mui/material';
import ReviewsOverview from '../reviewsOverview/ReviewsOverview';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import {
  useProductReviews,
  useReviewSortFilters,
} from '@/hooks/queries/useProductReviews';
import type { Image } from '@/types/image';
import LightboxComponent from '@/ui-kit/LightBox';
import { useProductRating } from '@/hooks/queries/useProductRating';
import { SortByMenu, SortByMenuOption } from '@/ui-kit/menu';
import { FormCheckbox } from '@/ui-kit/inputs';

interface ReviewsPanelProps {
  product: Product;
}

const menuValues: Record<string, string> = {
  date_desc: 'Newest',
  date_asc: 'Oldest',
  rating_asc: 'First With a Low Rating',
  rating_desc: 'First With a Hight Rating',
};

export const menuOptions: SortByMenuOption[] = [
  {
    name: 'Newest',
    value: 'date_desc',
  },
  {
    name: 'Oldest',
    value: 'date_asc',
  },
  {
    name: 'First With a Low Rating',
    value: 'rating_asc',
  },
  {
    name: 'First With a High Rating',
    value: 'rating_desc',
  },
];

const ReviewImage = ({
  handleClickImage,
  image,
  index,
  totalImages,
}: {
  image: Image;
  handleClickImage: () => void;
  index: number;
  totalImages: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [wrap, setWrap] = useState(false);
  const [showHidden, setShowHidden] = useState<null | number>(null);

  const checkLastWrappedItem = useCallback(() => {
    // Check if the element is wrapped
    const firstParentChild = ref.current?.parentElement
      ?.firstElementChild as HTMLElement;
    if (!firstParentChild) {
      return;
    }

    const firstOffsetWidth = firstParentChild.offsetWidth;
    const parentOffsetWidth = ref.current?.parentElement?.offsetWidth;

    const limit = (index + 1) * firstOffsetWidth;

    if (parentOffsetWidth) {
      const siblingsHidden =
        totalImages - Math.floor(parentOffsetWidth / firstOffsetWidth);

      if (siblingsHidden > 0 && totalImages - siblingsHidden === index + 1) {
        setShowHidden(siblingsHidden);
      } else {
        setShowHidden(null);
      }
    }

    if (parentOffsetWidth && limit > parentOffsetWidth) {
      setWrap(true);
    } else if (wrap) {
      setWrap(false);
    }
  }, [index, totalImages, wrap]);

  useEffect(() => {
    checkLastWrappedItem();
  }, [checkLastWrappedItem]);

  useEffect(() => {
    window.addEventListener('resize', checkLastWrappedItem);

    return () => {
      window.removeEventListener('resize', checkLastWrappedItem);
    };
  }, [checkLastWrappedItem]);

  return (
    <Grid
      item
      key={image.id}
      ref={ref}
      sx={{
        display: wrap ? 'none' : 'flex',
      }}
    >
      <ButtonBase onClick={handleClickImage}>
        {!!showHidden && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',

              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7))',
            }}
          >
            <Typography>+{showHidden}</Typography>
          </Box>
        )}
        <NextImage
          key={image.id}
          alt={image.fileName}
          src={image.url}
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
      </ButtonBase>
    </Grid>
  );
};

export const ReviewsPanel = ({ product }: ReviewsPanelProps): JSX.Element => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [index, setIndex] = useState(0);
  const { sort_by, with_media } = useReviewSortFilters();
  const {
    reviews: swrReviews,
    isLoading: isLoadingReviews,
    size,
    setSize,
  } = useProductReviews(product.id, {
    sort_by,
    with_media,
  });
  const {
    reviews: swrReviewsWithImages,
    isLoading: isLoadingReviewsWithImages,
  } = useProductReviews(product.id, { limit: 20, with_media: true });

  const { data: rating, isLoading: isLoadingRating } = useProductRating(
    product.id,
  );

  const { reviews, allReviews } = useMemo(() => {
    const reviews = swrReviews.flatMap((s) => s?.results ?? []) ?? [];
    const allReviews =
      swrReviewsWithImages.flatMap((s) => s?.results ?? []) ?? [];
    return { reviews, allReviews };
  }, [swrReviewsWithImages, swrReviews]);

  // INFO: Use this to know if there are more available reviews to load
  const isEnd = useMemo(
    () =>
      (swrReviews?.[0]?.total ?? Number.POSITIVE_INFINITY) <= reviews.length,
    [reviews.length, swrReviews],
  );

  const isLoadingAll = useMemo(
    () => isLoadingReviews || isLoadingReviewsWithImages || isLoadingRating,
    [isLoadingReviews, isLoadingReviewsWithImages, isLoadingRating],
  );

  const getSelectedSort = () => {
    if (sort_by) {
      const valueName = menuValues[sort_by];
      if (valueName) {
        return {
          name: valueName,
          value: sort_by,
        };
      }
    }
    return menuOptions[0];
  };

  const [media, setMedia] = useState(with_media ? with_media : '');
  const [selectedSort, setSelectedSort] = useState(getSelectedSort());
  const { replace } = useRouteReplace();

  const handleClickImage = (index: number) => {
    setOpenLightbox(true);
    setIndex(index);
  };

  const allImages = useMemo(() => {
    let images: {
      image: Image;
      authorName: string;
      comment: string;
    }[] = [];

    allReviews?.forEach((review) => {
      if (review.images.length) {
        images = [
          ...images,
          ...review.images.map((image) => ({
            comment: review.comment ?? '',
            image,
            authorName: `${review.author.firstName} ${review.author.lastName}`,
          })),
        ];
      }
    });

    return images;
  }, [allReviews]);

  const hasReviews = reviews?.length > 0;

  const handleLoadMore = () => {
    setSize(size + 1);
  };

  return (
    <Grid
      sx={{
        marginTop: { xs: '24px', sm: '48px' },

        display: 'flex',
        minHeight: '300px',
      }}
      container
      columnSpacing={'40px'}
    >
      <LightboxComponent
        index={index}
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={allImages.map((image) => ({
          src: image.image.url,
          title: image.authorName,
          description: image.comment,
        }))}
      />
      <Grid item xs={12} md>
        <Box
          sx={{
            width: '100%',
          }}
        >
          {Boolean(allImages.length > 0 || isLoadingAll) && (
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '24px',
              }}
              component="h4"
            >
              {isLoadingAll ? <Skeleton /> : 'Сustomer photos and videos'}
            </Typography>
          )}
          {Boolean(allImages.length) && (
            <Grid container columnSpacing="10px" mb="24px">
              {allImages.map(({ image }, i) => (
                <ReviewImage
                  image={image}
                  handleClickImage={() => handleClickImage(i)}
                  key={image.id}
                  index={i}
                  totalImages={allImages.length}
                />
              ))}
            </Grid>
          )}
          {isLoadingAll && (
            <Grid container spacing="10px">
              {Array.from({ length: 5 }).map((_, index) => (
                <Grid
                  item
                  key={`${product.id}-review-images-skeleton-${index}`}
                >
                  <Box
                    sx={{
                      height: {
                        xs: '78px',
                        sm: '100px',
                      },
                      width: {
                        xs: '78px',
                        sm: '100px',
                      },
                    }}
                  >
                    <Skeleton variant="rounded" height="100%" width="100%" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {isLoadingAll ||
            (hasReviews && (
              <Box
                sx={{
                  display: {
                    sm: 'none',
                  },
                  margin: '24px 0',
                }}
              >
                {isLoadingAll && (
                  <Skeleton width="100%" height={360} variant="rounded" />
                )}
                {!isLoadingAll && hasReviews && rating?.data && (
                  <ReviewsOverview ratingData={rating?.data} />
                )}
                <Divider
                  sx={{
                    marginTop: '24px',
                  }}
                />
              </Box>
            ))}
          {isLoadingAll && (
            <Skeleton
              variant="rounded"
              width="100%"
              height={46}
              sx={{
                mt: '24px',
              }}
            />
          )}

          {!isLoadingAll && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <SortByMenu
                options={menuOptions}
                selected={selectedSort}
                setSelected={(option) => {
                  setSelectedSort(option);

                  const mediaValue = media.toString();
                  replace({
                    sort_by: option.value.toString(),
                    with_media: mediaValue,
                  });
                }}
              />
              <FormCheckbox
                label="Only with photo or video"
                checked={media === 'true'}
                onChange={() => {
                  setMedia((value) => (value === 'true' ? 'false' : 'true'));
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              marginTop: '24px',
              width: '100%',
            }}
          >
            {isLoadingAll && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: '40px',
                }}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={`${product.id}-reviews-skeleton-${index}`}
                    variant="rounded"
                    height={200}
                    width="100%"
                  />
                ))}
              </Box>
            )}

            {hasReviews && (
              <>
                <ReviewsList reviews={reviews} />
                {isEnd ? null : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button onClick={handleLoadMore}>
                      {isLoadingAll ? 'Loading...' : 'Show more comment'}
                    </Button>
                  </Box>
                )}
              </>
            )}

            {!hasReviews && !isLoadingAll && (
              <Typography
                sx={{
                  width: '100%',
                  fontSize: { xs: '24px', md: '32px' },
                }}
                variant="h4"
              >
                There are no reviews yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md="auto"
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
      >
        {isLoadingAll && (
          <Skeleton width={475} height={360} variant="rounded" />
        )}
        {!isLoadingAll && hasReviews && rating?.data && (
          <ReviewsOverview ratingData={rating.data} />
        )}
      </Grid>
    </Grid>
  );
};
