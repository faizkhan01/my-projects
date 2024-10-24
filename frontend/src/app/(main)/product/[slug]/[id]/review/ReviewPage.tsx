'use client';
import { DragEvent } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  InputLabel,
  Rating,
  TextField,
  CardActionArea,
  Stack,
  FormHelperText,
} from '@mui/material';
import { Star } from '@phosphor-icons/react';
import { ContainedButton, BackLinkButton } from '@/ui-kit/buttons';
import { CustomContainer } from '@/ui-kit/containers';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createProductReview } from '@/services/API/products';
import { useParams, useRouter } from 'next/navigation';
import { handleAxiosError } from '@/lib/axios';
import routes from '@/constants/routes';
import { Product } from '@/types/products';

const PageTitle = styled('h1')(({ theme }) => ({
  marginBottom: '40px',
  fontWeight: '600',
  fontSize: '40px',
  LineHeight: '48px',
  marginTop: '15px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '24px',
  },
}));

const ProductContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  marginBottom: '40px',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    gap: '14px',
    flexDirection: 'column',
    marginBottom: '24px',
  },

  [theme.breakpoints.down('md')]: {},
}));

const ThumbnailHolder = styled(Box)(({ theme }) => ({
  aspectRatio: '1/1',
  position: 'relative',
  borderRadius: '2px',
  overflow: 'hidden',
  width: '240px',
  height: '240px',
  [theme.breakpoints.down('sm')]: {
    height: '80px',
    width: '80px',
  },
}));

const InputGroup = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {},
}));

const TEXTAREA_STYLES = {
  background: ' #F6F9FF',
  width: '100%',
  borderRadius: '10px',
  position: 'relative',
  '& .MuiInputBase-root': { padding: '16px 24px' },
  '& .MuiOutlinedInput-notchedOutline': { border: '0' },
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    right: '0',
    bottom: '8px',
    fontSize: '12px',
  },
};

const Label = styled(InputLabel)(() => ({
  fontWeight: '600',
  fontSize: '18px',
  lineHeight: '24px',
  marginBottom: '1rem',
  color: '#333E5C',
}));

const schema = yup
  .object()
  .shape({
    comment: yup.string().max(500, 'It can"t have more than 500 characters'),
    rating: yup
      .number()
      .min(1, 'Please provide a rating for this product')
      .max(5, 'The rating can"t be greater than 5')
      .required('Please provide a rating for this product'),
  })
  .required();

interface ReviewFormData {
  comment: string;
  rating: number;
  images?: FileList | null;
}

const Review = ({
  product,
  orderItemId,
}: {
  product: Product;
  orderItemId: number;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      comment: '',
      rating: 0,
    },
    mode: 'onChange',
  });

  const { push } = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const id = Number(params.id as string);

  const onSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    try {
      if (isNaN(id) || isNaN(orderItemId)) return;

      await createProductReview(id, { ...data, orderItemId });

      push(routes.PRODUCTS.INFO(slug, id));
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const onDropImage = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;

    for (const file of Array.from(files)) {
      if (!file.type.includes('image')) {
        setError('images', {
          type: 'manual',
          message: 'Only images are allowed',
        });
        setValue('images', null);
        return;
      }
    }

    clearErrors('images');
    setValue('images', e.dataTransfer.files);
  };

  const images = watch('images');

  const imagesLengthError =
    errors?.images?.message ?? (images && images?.length > 10)
      ? 'You can"t upload more than 10 images'
      : '';

  const imagesError = errors?.images?.message ?? imagesLengthError;
  const hasImageError = Boolean(imagesError);
  const imagesMessage = images?.length
    ? `${images.length} ${images.length === 1 ? 'image' : 'images'} added`
    : '';

  return (
    <CustomContainer>
      <BackLinkButton mode="history" />
      <Box sx={{ maxWidth: '570px' }}>
        <PageTitle>Your Product Review</PageTitle>
        <ProductContent>
          {product.images.length && (
            <ThumbnailHolder>
              <Image
                src={product.images?.[0]?.url}
                fill
                alt={`Image of ${product.name}`}
              />
            </ThumbnailHolder>
          )}
          <Typography
            sx={{
              display: 'flex',
              textAlign: {
                xs: 'center',
                sm: 'left',
              },
              flex: 1,
            }}
            fontWeight={600}
            fontSize={{
              xs: 16,
              sm: 32,
            }}
            lineHeight="38px"
            component="h2"
          >
            {product.name}
          </Typography>
        </ProductContent>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={{
              xs: '24px',
              sm: '40px',
            }}
          >
            <Controller
              name="rating"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <div>
                    <div className="flex items-center gap-[14px] md:flex-col md:items-start md:gap-0">
                      <Label
                        sx={{
                          marginBottom: {
                            xs: 0,
                            sm: '1rem',
                          },
                          fontSize: {
                            xs: '14px',
                            sm: '18px',
                          },
                        }}
                      >
                        Rating
                      </Label>
                      <Rating
                        sx={{
                          '& label': {
                            paddingRight: '9px',
                          },
                        }}
                        icon={
                          <div className="text-warning-main">
                            <div className="hidden md:block">
                              <Star size={32} weight="fill" />
                            </div>
                            <div className="block md:hidden">
                              <Star size={24} weight="fill" />
                            </div>
                          </div>
                        }
                        emptyIcon={
                          <div className="text-[#EAECF4]">
                            <div className="hidden md:block">
                              <Star size={32} weight="fill" />
                            </div>
                            <div className="block md:hidden">
                              <Star size={24} weight="fill" />
                            </div>
                          </div>
                        }
                        {...field}
                      />
                    </div>
                    <FormHelperText error={!!error} sx={{}}>
                      {error?.message ?? ''}
                    </FormHelperText>
                  </div>
                );
              }}
            />

            <InputGroup>
              <Label htmlFor="comment">Comment (optional)</Label>
              <Controller
                name="comment"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    id="comment"
                    placeholder="Write the comment"
                    multiline
                    rows={7}
                    helperText={`${field.value.length}/500`}
                    sx={TEXTAREA_STYLES}
                    error={!!error}
                    {...field}
                  />
                )}
              />
            </InputGroup>

            <InputGroup>
              <Label>Add photo (optional)</Label>
              <Box
                sx={{
                  height: {
                    xs: '85px',
                    md: '150px',
                  },
                  width: '100%',
                  border: '1px dashed #5F59FF',
                  background: '#EEEDFF',
                  borderRadius: '10px',
                }}
                id="drop"
                onDragEnter={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onDragOver={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onDrop={onDropImage}
              >
                <CardActionArea
                  sx={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                  component="label"
                  htmlFor="file-input"
                >
                  <input
                    id="file-input"
                    type="file"
                    name="images"
                    hidden
                    accept=".jpg, .jpeg, .png"
                    multiple
                    aria-invalid={imagesError ? 'true' : 'false'}
                    onChange={(e) => {
                      setValue('images', e.target.files);
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'flex',
                        },
                        alignItems: 'center',
                      }}
                    >
                      Drag & drop your photo, or
                      <Typography
                        sx={{
                          fontWeight: '600',
                          fontSize: '16px',
                          color: '#5F59FF',
                          marginLeft: '4px',
                        }}
                        component="span"
                      >
                        browse photo
                      </Typography>
                    </Typography>
                    <Typography
                      fontSize={14}
                      fontWeight={600}
                      sx={{
                        display: {
                          xs: 'flex',
                          sm: 'none',
                        },
                        color: 'primary.main',
                        alignItems: 'center',
                      }}
                    >
                      Upload a photo
                    </Typography>

                    <Typography
                      mt={2}
                      fontSize={{
                        xs: 12,
                        sm: 14,
                      }}
                      fontWeight={400}
                      color="#96A2C1"
                    >
                      Up to 10 images in format PGN, JPG
                    </Typography>
                  </Box>
                </CardActionArea>

                <FormHelperText error={hasImageError}>
                  {imagesError || imagesMessage}
                </FormHelperText>
              </Box>
            </InputGroup>

            <ContainedButton
              className="w-[270px]"
              type="submit"
              disabled={hasImageError}
              loading={isSubmitting}
            >
              Send a review
            </ContainedButton>
          </Stack>
        </form>
        <Typography
          fontSize={14}
          fontWeight={400}
          mt={2}
          sx={{ marginBottom: '100px' }}
        >
          By clicking “Send a review”, you agree to the{' '}
          <Link href="/" style={{ color: '#5F59FF', textDecoration: 'none' }}>
            publishing rules
          </Link>
        </Typography>
      </Box>
    </CustomContainer>
  );
};

export default Review;
