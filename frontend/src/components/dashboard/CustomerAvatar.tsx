import { Avatar, Box, Button } from '@mui/material';
import { Camera } from '@phosphor-icons/react';
import routes from '@/constants/routes';
import { EditProfileData, ProfileData } from '@/types/user';
import { usePathname } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '../uploaders/Upload';

interface CustomerAvatarProps {
  variant?: 'mobile' | 'default';
  profile: ProfileData;
}

const CustomerAvatar = ({
  variant = 'default',
  profile,
}: CustomerAvatarProps): JSX.Element => {
  const pathname = usePathname();
  const methods = useFormContext<EditProfileData>();
  const avatar = methods?.watch('avatar');

  const isInEdit = pathname.includes(routes.DASHBOARD.EDIT_PROFILE);
  const isMobile = variant === 'mobile';
  const iconSize = isMobile ? 24 : 32;

  const onChangeAvatar = (acceptedFiles: File[]) => {
    for (const file of Array.from(acceptedFiles)) {
      if (!file.type.includes('image')) {
        methods?.setError('avatar', {
          type: 'manual',
          message: 'Only images are allowed',
        });
        methods?.setValue('avatar', null);
        return;
      }
    }

    const newAvatar: UploadFile = Object.assign(acceptedFiles[0], {
      preview: URL.createObjectURL(acceptedFiles[0]),
    });

    methods?.setValue('avatar', newAvatar as File, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onChangeAvatar,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        width: isMobile ? '70px' : '100px',
        height: isMobile ? '70px' : '100px',
      }}
      component={isInEdit ? 'label' : 'div'}
      htmlFor={isInEdit ? 'avatar' : ''}
      {...(isInEdit ? getRootProps() : {})}
    >
      <Avatar
        src={
          typeof File !== 'undefined' && avatar instanceof File
            ? URL.createObjectURL(avatar)
            : profile?.avatar?.url
        }
        sx={{
          width: '100%',
          height: '100%',
          color: 'text.secondary',

          backgroundColor: isInEdit ? 'primary.main' : '#EAECF4',
          '& > img': {
            opacity: isInEdit ? 0.6 : 1,
          },
        }}
      >
        {!isInEdit && <Camera size={iconSize} />}
      </Avatar>
      {isInEdit && (
        <>
          <Button
            sx={{
              position: 'absolute',
              color: 'common.white',
              zIndex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
            component="span"
          >
            <Camera size={iconSize} />
          </Button>
          <input {...getInputProps()} id="avatar" />
        </>
      )}
    </Box>
  );
};

export default CustomerAvatar;
