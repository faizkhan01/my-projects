import { useFormContext, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { List, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ContainedButton,
  BackLinkButton,
  OutlinedButton,
} from '@/ui-kit/buttons';
import ControlledFormInput from '@/components/hookForm/ControlledFormInput';
import { removeEqualProperties } from '@/utils/forms';
import { EditProfileData } from '@/types/user';
import { useAuthActions } from '@/hooks/auth/auth.actions';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { ControlledNumber } from '../hookForm/ControlledNumber';
import { ProfileData } from '@/types/user';
import CustomerAvatar from '../dashboard/CustomerAvatar';
import { handleAxiosError } from '@/lib/axios';
import { useAuthStore } from '@/hooks/stores/useAuthStore';
import routes from '@/constants/routes';

interface EditAccountProps {
  profile: ProfileData;
}

type FormDataType = EditProfileData;

const ContactInfoHeader = styled('h3')({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 'bold',
  fontSize: '24px',
  margin: 0,
  marginBottom: '24px',
});

const Circle = styled('div')(({ theme }) => ({
  height: '8px',
  width: '8px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
}));

const PasswordTip = styled('li')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const EditAccount = ({ profile }: EditAccountProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, isValid, defaultValues },
  } = useFormContext<FormDataType>();
  const { loading, editProfile } = useAuthActions();
  const updateAuth = useAuthStore((state) => state.initialize);

  const onSubmit: SubmitHandler<FormDataType> = async () => {
    // avoid to submit if the form hasn't changed
    if (!isDirty || !defaultValues) {
      return;
    }

    // For some reason data from handleSubmit doesn"t return the added avatar, it's always null,
    // so here I'm using getValues to get the actual updated data
    const data = getValues();

    const updateData = removeEqualProperties(data, defaultValues, {
      removeNull: true,
    });

    if (!updateData) return;

    // remove empty properties from data
    try {
      const response = await editProfile(updateData);
      showSuccessSnackbar(response.message);
      // reset form with new values
      reset({
        ...defaultValues,
        ...response.data,
      });
      updateAuth();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <form
      className="fle h-fit w-full flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          marginBottom: '22px',
        }}
        spacing="22px"
      >
        <BackLinkButton text="Edit Profile" />
        <Stack spacing="3px">
          <CustomerAvatar variant="mobile" profile={profile} />
          <Typography
            fontSize="18px"
            component="h3"
            fontWeight="bold"
            lineHeight="32px"
          >
            {profile.firstName} {profile.lastName}
          </Typography>
        </Stack>
      </Stack>
      <ContactInfoHeader>Contact Information</ContactInfoHeader>
      <Grid
        mb="48px"
        columnSpacing={{
          xs: 1,
          sm: '30px',
        }}
        rowSpacing={3}
        container
      >
        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="firstName"
            name="firstName"
            control={control}
            label="First Name"
            placeholder="First Name"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="lastName"
            name="lastName"
            control={control}
            label="Last Name"
            placeholder="Last Name"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="email"
            name="email"
            control={control}
            label="Email Address"
            placeholder="email@example.com"
            InputProps={{
              autoComplete: 'email',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ControlledNumber
            id="phone"
            name="phone"
            control={control}
            label="Phone Number"
            placeholder="123 456 7890"
            international
          />
        </Grid>
      </Grid>
      <ContactInfoHeader>Password Settings</ContactInfoHeader>
      <Grid
        columnSpacing={{
          xs: 1,
          sm: '30px',
        }}
        rowSpacing={3}
        container
      >
        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="password"
            type="password"
            name="oldPassword"
            control={control}
            label="Current Password"
            placeholder="******"
            InputProps={{
              autoComplete: 'current-password',
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="newPassword"
            type="password"
            name="newPassword"
            control={control}
            label="New Password"
            placeholder="******"
            InputProps={{
              autoComplete: 'new-password',
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <ControlledFormInput
            id="passwordConfirmation"
            type="password"
            name="newPasswordConfirmation"
            control={control}
            label="Confirm New Password"
            placeholder="******"
            InputProps={{
              autoComplete: 'new-password',
            }}
          />
        </Grid>
      </Grid>
      <List className="mt-6 flex flex-col gap-4 p-0">
        <PasswordTip>
          <Circle />
          Your password must be 8-40 characters
        </PasswordTip>
        <PasswordTip>
          <Circle />
          Must contain at least 1 letter
        </PasswordTip>
        <PasswordTip>
          <Circle />
          Must contain at least 1 number
        </PasswordTip>
        <PasswordTip>
          <Circle />
          The new password match confirm password
        </PasswordTip>
      </List>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-[30px]">
        <ContainedButton
          size="large"
          className="w-full max-w-full sm:max-w-[270px]"
          type="submit"
          loading={loading}
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </ContainedButton>
        <Link href={routes.DASHBOARD.INDEX} passHref legacyBehavior>
          <OutlinedButton
            size="large"
            className="w-full max-w-full sm:max-w-[270px]"
            variant="outlined"
          >
            Cancel
          </OutlinedButton>
        </Link>
      </div>
    </form>
  );
};

export default EditAccount;
