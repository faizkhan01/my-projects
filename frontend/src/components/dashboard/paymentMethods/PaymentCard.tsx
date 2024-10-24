import { Box, Typography } from '@mui/material';
import { XCircle } from '@phosphor-icons/react';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { CARDS, CardType } from '@/constants/cards';

interface PaymentCardProps {
  brand: CardType;
  last4: string;
  onDelete?: () => void;
}

export const PaymentCard = ({ brand, last4, onDelete }: PaymentCardProps) => {
  return (
    <Box
      sx={{
        width: {
          xs: '100%',
        },
        height: '124px',
        borderRadius: '10px',
        border: '1px solid #EAECF4',
        filter:
          'drop-shadow(0px 4px 53px rgba(0, 0, 0, 0.04)) drop-shadow(0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02))',
        position: 'relative',
      }}
    >
      {onDelete && (
        <Box
          sx={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            color: 'error.main',
          }}
        >
          <IconButton
            sx={{
              color: 'error.main',
            }}
            onClick={() => onDelete()}
          >
            <XCircle size={18} weight="fill" />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '28.5px',
        }}
      >
        <Box
          sx={{
            mb: '22.5px',
          }}
        >
          <Image
            src={
              typeof brand === 'string' && brand in CARDS
                ? CARDS[brand]
                : CARDS['mastercard']
            }
            alt="mastercard"
            width={40}
            height={28}
          />
        </Box>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '24px',
            textAlign: 'center',
            color: 'text.primary',
            letterSpacing: '0.3em',
          }}
        >
          {`**** **** **** ${last4}`}
        </Typography>
      </Box>
    </Box>
  );
};
