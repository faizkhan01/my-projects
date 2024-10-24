import {
  Box,
  ButtonBase,
  CardActionArea,
  CardActionAreaProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { X } from '@phosphor-icons/react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

export interface UploadFile extends Partial<File> {
  name: string;
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  description?: string;
  thumbnail?: boolean;
  error?: boolean;
  file?: UploadFile;
  files?: UploadFile[];
  onRemove?: (file: UploadFile) => void;
  helperText?: React.ReactNode;
}

const ImageBox = styled(CardActionArea<'div'>, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'error',
})<CardActionAreaProps & { error?: boolean }>(({ theme, error }) => {
  return {
    display: 'flex',
    height: '150px',
    borderRadius: '10px',
    width: '100%',
    backgroundColor: theme.palette.info.main,
    outline: error ? `1px solid ${theme.palette.error.main}` : 'none',
    backgroundImage: error
      ? 'none'
      : `linear-gradient(to left, ${theme.palette.primary.main} 50%, transparent 50%), linear-gradient(to left, ${theme.palette.primary.main} 50%, transparent 50%), linear-gradient(to top, ${theme.palette.primary.main} 50%, transparent 50%), linear-gradient(to top, ${theme.palette.primary.main} 50%, transparent 50%)`,
    backgroundPosition: 'left top, left bottom, left top, right top',
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '19.5px 1px, 19.5px 1px, 1px 19.5px, 1px 19.5px',

    [theme.breakpoints.down('sm')]: {
      height: '85px',
    },
  };
});

const BoxTitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  marginTop: '16px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const DragDropText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    display: 'none',
  },
}));

const DESKTOP_PHOTO_TEXT = {
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  marginLeft: '4px',
  color: 'primary.main',
  display: {
    xs: 'none',
    md: 'block',
  },
};

const MOBILE_PHOTO_TEXT = {
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  marginLeft: '4px',
  display: {
    xs: 'block',
    md: 'none',
  },
  color: 'primary.main',
};

const Upload = ({
  description,
  multiple,
  thumbnail = false,
  error,
  files,
  /* file, */
  onRemove,
  helperText,
  ...props
}: UploadProps) => {
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    multiple,
    ...props,
  });

  const isError = isDragReject || !!error;
  /* const hasFile = file && !multiple; */
  const hasFiles = !!files?.length && multiple;

  return (
    <Box>
      <ImageBox {...getRootProps()} component="div" error={isError}>
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <DragDropText>Drag & drop your photo, or </DragDropText>
            <Typography sx={DESKTOP_PHOTO_TEXT}>browse photo</Typography>
            <Typography sx={MOBILE_PHOTO_TEXT}>Upload a photo</Typography>
          </Box>
          {description && <BoxTitleText>{description}</BoxTitleText>}
        </Box>
      </ImageBox>

      {helperText && helperText}

      {thumbnail && hasFiles && (
        <Box
          sx={{
            display: 'flex',
            overflow: 'auto',
            padding: {
              xs: '16px 0px',
              md: '24px 0px',
            },
            alignItems: 'center',
            gap: '16px',
            marginBottom: '10px',
          }}
        >
          {files?.map((file, i) => (
            <Box
              key={`${file.name}${i}`}
              sx={{
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '2px',
                }}
              >
                <Image
                  src={file?.preview ?? URL.createObjectURL(file as File)}
                  width={100}
                  height={100}
                  alt={file?.name ?? 'file'}
                  priority
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                }}
              >
                <ButtonBase
                  sx={{
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'error.main',
                    color: 'common.white',
                    borderRadius: '50%',
                  }}
                  onClick={() => onRemove?.(file)}
                >
                  <X size={14} />
                </ButtonBase>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Upload;
