import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Rating from '@mui/material/Rating';
import { Star, Share, Warning } from '@phosphor-icons/react';
import { Box, Stack, Typography, Button, ButtonBase } from '@mui/material';
import { AnswerButton } from '@/ui-kit/buttons';
import type { ProductReview } from '@/types/products';
import dayjs from 'dayjs';
import LightboxComponent from '@/ui-kit/LightBox';
import React, { useState } from 'react';

interface ReviewCardProps {
  review: ProductReview;
}

const AuthorName = styled(Typography)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  fontWeight: '600',
  fontSize: '18px',
  lineHeight: '24px',
  color: theme.palette.text.primary,
  fontStyle: 'normal',

  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    lineHeight: '24px',
    margin: '14px 0px',
    order: 2,
    gap: '0.5rem',
  },
}));

const CardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
}));

const DateWithStar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '18px',
  color: theme.palette.text.secondary,
  fontStyle: 'normal',

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    width: '100%',
    order: 1,
  },
}));

const CustomerComment = styled(Typography)(({ theme }) => ({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '22px',
  color: theme.palette.text.primary,
  fontStyle: 'normal',

  [theme.breakpoints.down('sm')]: {
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '20px',
  },
}));

const QuestionText = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '16px',
  fontStyle: 'normal',
  marginTop: '24px',
  marginBottom: '16px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontWeight: '600',
    fontSize: '12px',
    marginBottom: '12px',
    lineHeight: '16px',
  },
}));

const ImageBox = styled(ButtonBase)(({ theme }) => ({
  display: 'block',
  borderRadius: '2px',
  overflow: 'hidden',
  position: 'relative',
  width: '150px',
  height: '150px',
  flex: 1,

  [theme.breakpoints.down('sm')]: {
    width: '78px',
    height: '78px',
  },
}));

const DESKTOP_BTN_ICON = {
  display: {
    xs: 'none',
    md: 'block',
  },
};

const MOBILE_BTN_ICON = {
  display: {
    xs: 'block',
    md: 'none',
  },
};

const BUTTON_SPAN = {
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '16px',
  fontStyle: 'normal',
  paddingLeft: '8px',
  display: { xs: 'none', md: 'block' },
};

const BUTTON_STYLED = {
  color: 'primary.main',
  cursor: 'pointer',
  minWidth: 'auto',
  fontWeight: '600',
};

const RED_BUTTON_STYLED = {
  color: 'error.main',
  minWidth: 'auto',
  cursor: 'pointer',
};

const AnswerButtons = () => (
  <Stack
    sx={{
      width: '100%',
      '& > button': {
        minWidth: 'auto',
        padding: '5px 10px',
        width: {
          sm: '60px',
          md: '70px',
        },
        height: {
          sm: '30px',
          md: '30px',
        },
        fontSize: {
          xs: '12px',
          md: '14px',
        },
      },
    }}
    gap={2}
    direction="row"
  >
    <AnswerButton>Yes:12</AnswerButton>
    <AnswerButton>No: 1</AnswerButton>
  </Stack>
);

const ReviewCard = ({
  review: { author, createdAt, rating, comment, images },
}: ReviewCardProps): JSX.Element => {
  const authorName = `${author.firstName} ${author.lastName}`;
  const hasComment = Boolean(comment);

  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleClick = (index: React.SetStateAction<number>) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        overflow: 'hidden',
      }}
    >
      <CardHeader>
        <AuthorName>
          <span>{authorName}</span>

          <Typography
            component="span"
            sx={{
              fontSize: '14px',
              lineHeight: '24px',

              color: 'text.secondary',
            }}
          >
            Verified Buyer
          </Typography>
        </AuthorName>
        <DateWithStar>
          {dayjs(createdAt).format('D MMMM YYYY')}
          <Rating
            sx={{
              display: 'flex',
              gap: '9px',
            }}
            name="product-rating"
            value={rating}
            precision={0.25}
            icon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={18} weight="fill" />
              </Box>
            }
            emptyIcon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={18} />
              </Box>
            }
            readOnly
          />
        </DateWithStar>
      </CardHeader>

      {hasComment && (
        <Box
          sx={{
            margin: {
              xs: '0 0 24px 0',
              sm: '24px 0',
            },
          }}
        >
          <CustomerComment>{comment}</CustomerComment>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: {
            xs: '10px',
            sm: '14px',
          },
          overflow: 'hidden',
          width: 'min-content',
        }}
      >
        {!!images.length &&
          images.map((reviewImage, index) => {
            return (
              <ImageBox key={reviewImage.id} onClick={() => handleClick(index)}>
                <Image
                  src={reviewImage.url}
                  alt={`Product Review Image ${reviewImage.id}`}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </ImageBox>
            );
          })}
        <LightboxComponent
          slides={images.map((image) => ({
            src: image.url,
            title: 'Review',
            description: comment,
          }))}
          open={open}
          close={handleClose}
          index={selectedIndex}
        />
      </Box>

      {false && (
        <>
          <QuestionText>That comment was helpful?</QuestionText>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                marginRight: '32px',
              }}
            >
              <AnswerButtons />
            </Box>
            <Box
              sx={{
                display: 'flex',
                marginLeft: {
                  xs: 'auto',
                  md: '0px',
                },
              }}
            >
              <Button sx={BUTTON_STYLED} variant="text">
                <Box sx={DESKTOP_BTN_ICON}>
                  <Share size={18} />
                </Box>
                <Box sx={MOBILE_BTN_ICON}>
                  <Share size={24} />
                </Box>
                <Typography component="span" sx={BUTTON_SPAN}>
                  Reply to comment
                </Typography>
              </Button>
              <Button sx={RED_BUTTON_STYLED} variant="text">
                <Box sx={DESKTOP_BTN_ICON}>
                  <Warning size={18} />
                </Box>
                <Box sx={MOBILE_BTN_ICON}>
                  <Warning size={24} />
                </Box>
                <Typography component="span" sx={BUTTON_SPAN}>
                  Report a comment
                </Typography>
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ReviewCard;
