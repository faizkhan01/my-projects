import Link from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface CardProps {
  children: JSX.Element;
  label: string;
  url: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.palette.grey[400]}`,
  boxShadow:
    '0px 0.5008620619773865px 6.636422634124756px 0px #00000005,0px 4px 53px 0px #0000000A',
  borderRadius: '10px',

  [theme.breakpoints.down('sm')]: {
    borderRadius: '6px',
    border: 0,
  },
}));

export const CardItem = ({ children, label, url }: CardProps) => (
  <StyledCard>
    <Link href={url} passHref legacyBehavior>
      <CardActionArea
        sx={{
          width: { xs: '104px', md: '270px' },
          height: { xs: '87px', md: '124px' },
        }}
      >
        <CardContent
          sx={{
            pt: '24px',
            pb: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {children}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: '14px', md: '18px' },
                lineHeight: '24px',
              }}
            >
              {label}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Link>
  </StyledCard>
);
