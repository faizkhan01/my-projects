import { memo } from 'react';
import { List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReviewCard from '../reviewCard/ReviewCard';
import { ProductReview } from '@/types/products';

interface Props {
  reviews: ProductReview[];
}

const ListItemStyle = styled(ListItem)(() => ({
  width: '100%',
  display: 'block',
  paddingBottom: '40px',
}));

export const ReviewsList = memo(({ reviews }: Props) => {
  return (
    <List
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        padding: '0',
      }}
    >
      {reviews.map((review, i) => (
        <ListItemStyle
          key={review.id}
          disablePadding
          sx={{
            borderBottom:
              i === reviews.length - 1 ? 'none' : '1px solid #EAECF4',
          }}
        >
          <ReviewCard review={review} />
        </ListItemStyle>
      ))}
    </List>
  );
});

ReviewsList.displayName = 'ReviewsList';
