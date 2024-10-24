import { FormHelperText } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import Upload, { UploadProps } from '../uploaders/Upload';

type ControlledUploadProps<T extends FieldValues> = UploadProps &
  UseControllerProps<T>;

const ControlledUpload = <T extends FieldValues>({
  control,
  name,
  multiple,
  helperText,
  ...props
}: ControlledUploadProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Upload
          multiple={multiple}
          files={multiple ? field.value : undefined}
          file={!multiple ? field.value : undefined}
          accept={{ 'image/*': [] }}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText sx={{ pt: 1 }} error={!!error}>
                {error?.message || helperText}
              </FormHelperText>
            )
          }
          {...props}
        />
      )}
    />
  );
};

export default ControlledUpload;
