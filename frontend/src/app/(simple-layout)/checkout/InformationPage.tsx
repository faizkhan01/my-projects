import { styled } from '@mui/material/styles';
import { ContainedButton } from '@/ui-kit/buttons';
import { Box, Typography, Stack, TypographyProps, Button } from '@mui/material';
import { CheckoutForm } from './form';
import { useFormContext } from 'react-hook-form';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import useProfile from '@/hooks/queries/useProfile';
import AddressForm from './components/AddressForm';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import useAddresses from '@/hooks/queries/useAddresses';
import { ADDRESS_TYPES_ENUM } from '@/types/address';
import { ShippingAddressSelector } from './components/AddressSelector';

interface InformationPageProps {
  handleNext: () => void;
  type?: CheckoutForm;
}

const TitleText = styled((props: TypographyProps<'h2'>) => (
  <Typography component="h2" {...props} />
))<TypographyProps>(() => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  lineHeight: '22px',
}));

const LightText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 100,
  lineHeight: '14px',
  color: theme.palette.text.primary,
}));

const LoginButton = styled(Button)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '14px',
  marginLeft: '5px',
  color: theme.palette.primary.main,
}));

const InformationPage = ({ handleNext }: InformationPageProps) => {
  const methods = useFormContext<CheckoutForm>();
  const { profile } = useProfile();
  const { addresses: shippingAddresses } = useAddresses(
    ADDRESS_TYPES_ENUM.SHIPPING,
    Boolean(profile),
  );

  const { control, trigger } = methods;

  const open = useAuthModalStore((state) => state.open);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!profile && (
          <Box sx={{ mb: '40px' }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 2,
              }}
            >
              <TitleText>Contact</TitleText>
              <LightText>
                Already have an account?
                <LoginButton
                  onClick={() => {
                    open('login');
                  }}
                >
                  Log in
                </LoginButton>
              </LightText>
            </Stack>

            <ControlledFormInput
              id={`guestEmail`}
              name={`guestEmail`}
              control={control}
              label="Email Address"
              placeholder="Your email"
              InputProps={{
                autoComplete: 'email',
              }}
              type="email"
            />
            {/* <TitleText> */}
            {/*   <FormControlLabel */}
            {/*     sx={{ */}
            {/*       '&.MuiFormControlLabel-root': { */}
            {/*         marginLeft: '1px', */}
            {/*         marginTop: '16px', */}
            {/*       }, */}
            {/*     }} */}
            {/*     control={<Checkbox sx={{ marginRight: '8px' }} />} */}
            {/*     label="Send me news and offers" */}
            {/*   /> */}
            {/* </TitleText> */}
          </Box>
        )}

        <Box>
          <TitleText sx={{ marginBottom: '16px' }}>Shipping Address</TitleText>

          {shippingAddresses?.length ? (
            <ShippingAddressSelector />
          ) : (
            <AddressForm prefix="shipping" />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
        }}
      >
        <ContainedButton
          className="h-12 w-full md:w-[240px]"
          onClick={async () => {
            const res = await trigger(['shipping', 'guestEmail'], {
              shouldFocus: true,
            });

            if (res) {
              handleNext();
            }
          }}
          type="button"
        >
          Continue to shipping
        </ContainedButton>
      </Box>
    </>
  );
};

export default InformationPage;
