'use client';
import EditAccount from '@/components/editAccount/EditAccount';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EditProfileData, ProfileData, UserSettingsData } from '@/types/user';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { passwordSchema, emailSchema } from '@/utils/yupValidations';
import { yupResolver } from '@hookform/resolvers/yup';
import useProfile from '@/hooks/queries/useProfile';
import { phoneSchema } from '@/utils/yupValidations/phoneSchema';

const formSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: emailSchema,
  phone: phoneSchema,
  avatar: yup.mixed().nullable(),
  oldPassword: yup.string(),
  newPassword: yup.string().when('oldPassword', {
    is: (oldPassword: string) => oldPassword.length > 0,
    then: () => passwordSchema.required('New password is required'),
  }),
  newPasswordConfirmation: yup.string().when('newPassword', {
    is: (newPassword: string) => newPassword.length > 0,
    then: (s) =>
      s
        .required('Confirm your new password')
        .oneOf([yup.ref('newPassword')], 'Must match your new password'),
  }),
});

const EditAccountPage = ({
  user,
  profile: serverProfile,
}: {
  profile: ProfileData;
  user: UserSettingsData;
}) => {
  const methods = useForm<EditProfileData>({
    defaultValues: {
      firstName: user?.firstName || '',
      email: user?.email || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      avatar: null,
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
    resolver: yupResolver(formSchema),
  });
  // This is so when the edit profile gets submitted, it will be able to show the changes
  const { profile: clientProfile } = useProfile();
  const profile = clientProfile || serverProfile;

  return (
    <FormProvider {...methods}>
      <DashboardLayout profile={profile} title="Edit Profile">
        <EditAccount profile={profile} />
      </DashboardLayout>
    </FormProvider>
  );
};

export default EditAccountPage;
