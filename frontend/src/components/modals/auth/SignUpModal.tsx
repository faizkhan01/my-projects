import { shallow } from 'zustand/shallow';
import { memo, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, RadioGroup, ButtonBase } from '@mui/material';
import { RadioInput } from '@/ui-kit/inputs';
import { ModalCardContainer } from '@/ui-kit/containers';
import { PRegular, SubHeadingBold } from '@/ui-kit/typography';
import SignUpVendorForm from './forms/SignUpVendorForm';
import SignUpCustomerForm from './forms/SignUpCustomerForm';
import useAuthModalStore from '@/hooks/stores/useAuthModalStore';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type SelectedForm = 'customer' | 'vendor';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: SelectedForm;
  value: SelectedForm;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0.3, mt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SUBHEADING_STYLES = {
  cursor: 'pointer',
  '&:hover': {
    transition: '0.4s',
    color: 'primary.dark',
  },
};

const SignUpView: React.FC = memo(() => {
  const [selectedForm, setSelectedForm] = useState<SelectedForm>('customer');
  const { open } = useAuthModalStore(
    (state) => ({
      open: state.open,
    }),
    shallow,
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedForm((event.target as HTMLInputElement).value as SelectedForm);
  };

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: SelectedForm,
  ) => {
    setSelectedForm(newValue);
  };

  const renderForm = (selected?: SelectedForm): JSX.Element | null => {
    switch (selectedForm || selected) {
      case 'customer':
        return <SignUpCustomerForm />;
      case 'vendor':
        return <SignUpVendorForm />;
      default:
        break;
    }

    return null;
  };

  return (
    <ModalCardContainer title="Welcome" subTitle="Sign Up to continue">
      {isMobile ? (
        <Box
          sx={{
            width: '100%',
            mt: { xs: 3, sm: 0 },
            display: {
              xs: 'block',
              sm: 'none',
            },
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={selectedForm}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
              sx={{
                '& button': {
                  flex: 1,
                },
              }}
            >
              <Tab
                label="Register as a customer"
                {...a11yProps(0)}
                value="customer"
                sx={{
                  fontSize: '14px',
                }}
              />
              <Tab
                label="Register as a vendor"
                {...a11yProps(1)}
                value="vendor"
                sx={{
                  fontSize: '14px',
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={selectedForm} index={'customer'}>
            {renderForm('customer')}
            <Box sx={{ textAlign: 'center', pt: '32px' }}>
              <PRegular sx={{ pb: '7px' }}>Do you have an account?</PRegular>
              <ButtonBase onClick={() => open('login')}>
                <SubHeadingBold sx={SUBHEADING_STYLES} color="primary.main">
                  Sign In Now
                </SubHeadingBold>
              </ButtonBase>
            </Box>
          </TabPanel>
          <TabPanel value={selectedForm} index={'vendor'}>
            {renderForm('vendor')}
            <Box sx={{ textAlign: 'center', pt: '32px' }}>
              <PRegular sx={{ pb: '7px' }}>Do you have an account?</PRegular>
              <ButtonBase onClick={() => open('login')}>
                <SubHeadingBold sx={SUBHEADING_STYLES} color="primary.main">
                  Sign In Now
                </SubHeadingBold>
              </ButtonBase>
            </Box>
          </TabPanel>
        </Box>
      ) : (
        <>
          <RadioGroup
            value={selectedForm}
            onChange={handleChangeRadio}
            sx={{
              p: '40px 0',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: { xs: 8, sm: 0 },
              display: {
                xs: 'none',
                sm: 'flex',
              },
            }}
          >
            <RadioInput value="customer" label="Register as a customer" />
            <RadioInput value="vendor" label="Register as a vendor" />
          </RadioGroup>
          <StyledBox>
            {renderForm()}
            <Box sx={{ textAlign: 'center', pt: '32px' }}>
              <PRegular sx={{ pb: '7px' }}>Do you have an account?</PRegular>
              <ButtonBase onClick={() => open('login')}>
                <SubHeadingBold sx={SUBHEADING_STYLES} color="primary.main">
                  Sign In Now
                </SubHeadingBold>
              </ButtonBase>
            </Box>
          </StyledBox>
        </>
      )}
    </ModalCardContainer>
  );
});

SignUpView.displayName = 'SignUpView';

export default SignUpView;
