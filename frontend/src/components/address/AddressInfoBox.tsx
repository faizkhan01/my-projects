import { TypographyProps, Typography, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Envelope, MapPin, Phone, User } from '@phosphor-icons/react';
import { formatPhoneNumber } from 'react-phone-number-input';
import { Address } from '@/types/address';

interface AddressInfoBoxProps {
  address: Address;
  email: string;
}

const Style = styled((props) => (
  <Typography {...props} variant="h6" component="span" />
))<TypographyProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 400,

  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
}));

const IconContainer = styled(Box)(() => ({
  display: 'flex',
}));

const AddressInfoBox = ({
  address,
  email,
}: AddressInfoBoxProps): JSX.Element => {
  const street = `${address.addressOne} ${address?.addressTwo || ''}`.trim();

  return (
    <Stack
      spacing={{
        xs: '16px',
        md: '24px',
      }}
    >
      <Style>
        <IconContainer>
          <User size={24} />
        </IconContainer>
        <Box>{`${address.firstName} ${address.lastName}`}</Box>
      </Style>
      <Style>
        <IconContainer>
          <Phone size={24} />
        </IconContainer>
        <Box>{formatPhoneNumber(address.phone)}</Box>
      </Style>
      <Style>
        <IconContainer>
          <Envelope size={24} />
        </IconContainer>
        {email}
      </Style>
      <Style
        sx={{
          overflow: {
            xs: 'hidden',
            md: 'auto',
          },
        }}
      >
        <IconContainer>
          <MapPin size={24} />
        </IconContainer>
        <Box
          component="span"
          sx={{
            wordBreak: 'break-word',
          }}
        >
          {`${street}, ${address.city}, ${address.state.name} ${address.zipCode}`}
        </Box>
      </Style>
    </Stack>
  );
};

export default AddressInfoBox;
