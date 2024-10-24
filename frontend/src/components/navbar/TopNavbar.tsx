import React, { Suspense, useState } from 'react';
import { styled } from '@mui/material/styles';
import { PRegular } from '@/ui-kit/typography';
import { CustomContainer } from '@/ui-kit/containers';
import { ChatCircle, Fire } from '@phosphor-icons/react';
import { Box, Button } from '@mui/material';
import NewCurrencySelector from '@/components/currencySelector/CurrencySelector';
import useProfile from '@/hooks/queries/useProfile';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import dynamic from 'next/dynamic';

const SupportRequestModal = dynamic(
  () => import('@/components/modals/SupportRequestModal'),
);

const StyledBox = styled(Box)(({ theme }) => ({
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[50],
}));

const StyledFlexBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledListButton = styled(Button)(({ theme }) => ({
  width: 'inherit',
  display: 'flex',
  alignItems: 'center',
  padding: 5,
  color: theme.palette.text.primary,
  marginRight: '35px',
  cursor: 'pointer',
  '&:last-of-type': {
    marginRight: 0,
  },
  '&:hover': {
    transition: '0.4s',
    color: theme.palette.primary.main,
    '& p': {
      transition: '0.4s',
      color: theme.palette.primary.main,
    },
  },
}));

const SupportRequestHandler = () => {
  const [isSupportModal, setIsSupportModal] = useState(false);
  const { profile } = useProfile();

  return (
    <>
      <div className="flex items-center">
        <StyledListButton
          onClick={() => {
            if (!profile) {
              useAuthModalStore.getState().open('login');
              return;
            }
            setIsSupportModal(true);
          }}
        >
          <FlexBox>
            <ChatCircle />
            <PRegular sx={{ ml: '10px' }}>Help</PRegular>
          </FlexBox>
        </StyledListButton>
        <StyledListButton>
          <FlexBox>
            <Fire />
            <PRegular sx={{ ml: '10px' }}>Hot Sales</PRegular>
          </FlexBox>
        </StyledListButton>
      </div>
      {profile && (
        <SupportRequestModal
          open={isSupportModal}
          onClose={() => setIsSupportModal(false)}
        />
      )}
    </>
  );
};

const TopNavbar = () => {
  return (
    <StyledBox>
      <CustomContainer>
        <StyledFlexBox>
          <NewCurrencySelector className="w-auto" />
          <Suspense>
            <SupportRequestHandler />
          </Suspense>
        </StyledFlexBox>
      </CustomContainer>
    </StyledBox>
  );
};

export default TopNavbar;
