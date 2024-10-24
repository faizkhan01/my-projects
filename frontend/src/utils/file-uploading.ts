import { UploadFile } from '@/components/uploaders/Upload';
import { FileRejection } from 'react-dropzone';
import {
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';

export const onDropImageHandler =
  (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: UseFormGetValues<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError: UseFormSetError<any>,
    MAX_IMAGES_QUANTITY = 10,
  ) =>
  (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const files = getValues(key);

    for (const file of Array.from(acceptedFiles)) {
      if (!file.type.includes('image')) {
        setError(key, {
          type: 'manual',
          message: 'Only images are allowed',
        });
        setValue(key, null);
        return;
      }
    }

    const newFiles: UploadFile[] = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    const totalFiles: UploadFile[] = [...(files ?? []), ...newFiles];

    if (
      rejectedFiles.length > MAX_IMAGES_QUANTITY ||
      totalFiles.length > MAX_IMAGES_QUANTITY
    ) {
      return setError(key, {
        type: 'manual',
        message: `You can't upload more than ${MAX_IMAGES_QUANTITY} images`,
      });
    }

    setValue(key, totalFiles, {
      shouldValidate: true,
    });
  };

export const onRemoveImageHandler =
  (
    key: string,
    images: UploadFile[] | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>,
  ) =>
  (file: UploadFile) => {
    setValue(key, images?.filter((f) => f != file) ?? []);
  };
