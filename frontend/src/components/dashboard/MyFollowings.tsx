import { Box, Typography, Link as MuiLink } from '@mui/material';
import { BackLinkButton, ContainedButton } from '@/ui-kit/buttons';
import Link from 'next/link';
import routes from '@/constants/routes';
import { MobileHeading } from '@/ui-kit/typography';
import { styled } from '@mui/material/styles';
import type { FollowedStore } from '@/types/stores';
import Image from 'next/image';
import { SealCheck } from '@phosphor-icons/react';
import { useState } from 'react';
import { handleAxiosError } from '@/lib/axios';
import { deleteFollowStore } from '@/services/API/following';
import { mutate } from 'swr';
import { CUSTOMER } from '@/constants/api';

interface MyFollowingsProps {
  stores: FollowedStore[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  //   alignItems: 'center',
  backgroundColor: '#fff',
  padding: '20px',
  gap: '24px',

  border: '1px solid #EAECF4',
  borderRadius: '8px',

  [theme.breakpoints.down('sm')]: {},
}));

const StoresContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  marginTop: '32px',
  gap: '30px',

  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
}));

export const VerifiedButton = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
      {isVerified && <SealCheck size={20} color="#00D000" />}
      <Typography
        sx={{
          fontSize: '16px',
          lineHeight: '18px',
          color: isVerified ? '#00D000' : '#96A2C1',
          marginLeft: isVerified ? '8px' : '0',
        }}
      >
        {isVerified ? 'Verified' : 'Not verified'}
      </Typography>
    </Box>
  );
};

const MyFollowings = ({ stores }: MyFollowingsProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const unfollow = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteFollowStore(id);
      mutate(CUSTOMER.FOLLOWING);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <BackLinkButton />
      <MobileHeading title="My Followings" />
      <StoresContainer>
        {stores.map((followed) => (
          <StyledBox key={followed.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  marginRight: '12px',
                }}
              >
                <Image
                  src={
                    followed.store?.logo?.url ??
                    'https://i.ibb.co/n8PLzLg/4017634.jpg'
                  }
                  fill
                  alt={followed.store.name}
                  style={{ objectFit: 'cover', borderRadius: '90px' }}
                  priority
                />
              </Box>
              <Box>
                <MuiLink
                  component={Link}
                  href={routes.STORES.INFO(followed?.store?.slug)}
                  color="text.primary"
                  underline="none"
                >
                  {followed?.store?.name}
                </MuiLink>
                <VerifiedButton isVerified={true} />
              </Box>
            </Box>
            <ContainedButton
              className="bg-[#F6F9FF] py-[11px] text-primary-main hover:text-primary-dark"
              loading={isLoading}
              color="inherit"
              onClick={() => unfollow(followed.store.id)}
            >
              Unfollow
            </ContainedButton>
          </StyledBox>
        ))}
      </StoresContainer>
    </Box>
  );
};
export default MyFollowings;
