import Link from 'next/link';
import { Typography, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import TruckGlobeIcon from '@/assets/icons/TruckGlobeIcon';
import routes from '@/constants/routes';
import { BackLinkButton } from '@/ui-kit/buttons';
import { MobileHeading } from '@/ui-kit/typography';

const Container = styled(CardActionArea)(({ theme }) => ({
  backgroundColor: 'common.white',
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  padding: '24px',
  width: '420px',
  display: 'flex',
  alignItem: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  gap: '18px',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const SellerShipping = () => {
  return (
    <>
      <BackLinkButton />
      <MobileHeading title="Shipping" />

      <Link
        href={routes.SELLER_DASHBOARD.SHIPPING.METHODS.INDEX}
        passHref
        legacyBehavior
      >
        <Container>
          <Box
            sx={{
              backgroundColor: '#5F59FF',
              height: '60px',
              width: '60px',
              borderRadius: '50%',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TruckGlobeIcon />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '18px',
                lineHeight: '24px',
                marginBottom: '6px',
              }}
            >
              Shipping Methods
            </Typography>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '18px',
                color: '#96A2C1',
              }}
            >
              Manage how you ship out orders
            </Typography>
          </Box>
        </Container>
      </Link>
    </>
  );
};

export default SellerShipping;
