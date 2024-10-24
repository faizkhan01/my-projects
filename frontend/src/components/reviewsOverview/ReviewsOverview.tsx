import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { Star } from '@phosphor-icons/react';
import { GetProductRatingResponse } from '@/services/API/products';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  flex: 1,
  height: 4,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 400 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#FF8A00' : '#EAECF4',
  },
}));

const InnerStyle = styled('span')(() => ({
  fontWeight: 400,
  size: '14px',
  lineHeight: '18px',
  color: '#96A2C1',
}));

const InnerFont = styled('span')(() => ({
  fontWeight: 400,
  size: '14px',
  lineHeight: '18px',
  color: '#333E5C',
}));

const RatingRow = styled(Box)(() => ({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
}));
const ContainBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  width: '475px',
  justifyContent: 'center',
  borderRadius: '10px',
  background: '#FFFFFF',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  height: 'fit-content',

  [theme.breakpoints.down('sm')]: {
    width: 'auto',
    padding: '0px',
    borderRadius: '0px',
    backgroundColor: '#EACF4',
    boxShadow: 'none',
  },
}));

interface ReviewsOverviewProps {
  ratingData: GetProductRatingResponse['data'];
}

const ReviewsOverview = ({ ratingData }: ReviewsOverviewProps): JSX.Element => {
  const getPercentage = (n: number, total: number): number => {
    return (n / total) * 100;
  };

  const {
    rating_1: oneStar,
    rating_2: twoStar,
    rating_3: threeStar,
    rating_4: fourStar,
    rating_5: fiveStar,
    average: averageRating,
  } = ratingData;
  const totalReviews = fiveStar + fourStar + threeStar + twoStar + oneStar;

  const fiveStarPercentage = getPercentage(fiveStar, totalReviews);
  const fourStarPercentage = getPercentage(fourStar, totalReviews);
  const threeStarPercentage = getPercentage(threeStar, totalReviews);
  const twoStarPercentage = getPercentage(twoStar, totalReviews);
  const oneStarPercentage = getPercentage(oneStar, totalReviews);

  return (
    <ContainBox>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Rating
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
              gap: '1rem',
            }}
            name="product-rating"
            defaultValue={averageRating}
            precision={0.25}
            icon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={32} weight="fill" />
              </Box>
            }
            emptyIcon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={32} />
              </Box>
            }
            readOnly
          />
          <Rating
            sx={{
              display: {
                xs: 'flex',
                sm: 'none',
              },
              gap: '1rem',
            }}
            name="product-rating"
            defaultValue={4.8}
            precision={0.25}
            icon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={24} weight="fill" />
              </Box>
            }
            emptyIcon={
              <Box
                sx={{
                  color: 'warning.main',
                }}
              >
                <Star size={24} />
              </Box>
            }
            readOnly
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: '18px',
                sm: '24px',
              },
              color: '#333E5C',
            }}
            component="span"
          >
            {averageRating}/5
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <RatingRow>
            <InnerStyle>5 star</InnerStyle>

            <BorderLinearProgress
              variant="determinate"
              value={fiveStarPercentage}
            />

            <InnerFont>{fiveStar}</InnerFont>
          </RatingRow>
          <RatingRow>
            <InnerStyle>4 star</InnerStyle>

            <BorderLinearProgress
              variant="determinate"
              value={fourStarPercentage}
            />

            <InnerFont>{fourStar}</InnerFont>
          </RatingRow>
          <RatingRow>
            <InnerStyle>3 star</InnerStyle>
            <BorderLinearProgress
              variant="determinate"
              value={threeStarPercentage}
            />
            <InnerFont>{threeStar}</InnerFont>
          </RatingRow>
          <RatingRow>
            <InnerStyle>2 star</InnerStyle>

            <BorderLinearProgress
              variant="determinate"
              value={twoStarPercentage}
            />

            <InnerFont>{twoStar}</InnerFont>
          </RatingRow>
          <RatingRow>
            <InnerStyle>1 star</InnerStyle>

            <BorderLinearProgress
              variant="determinate"
              value={oneStarPercentage}
            />

            <InnerFont>{oneStar}</InnerFont>
          </RatingRow>
        </Box>
      </Box>
    </ContainBox>
  );
};

export default ReviewsOverview;
