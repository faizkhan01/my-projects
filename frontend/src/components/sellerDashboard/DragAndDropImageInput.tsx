import { Box, CardActionArea, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Plus } from '@phosphor-icons/react';
import { DragEvent } from 'react';

interface ImageBoxProps {
  styled: boolean;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

const ImageBox = ({ styled, onDrop, children }: ImageBoxProps) => {
  const theme = useTheme();
  return (
    <Box
      id="drop"
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={onDrop}
      sx={{
        ...(styled
          ? {
              height: '145px',
              borderRadius: '10px',
              backgroundColor: theme.palette.info.main,
              backgroundImage:
                'linear-gradient(to left, #5F59FF 50%, transparent 50%), linear-gradient(to left, #5F59FF 50%, transparent 50%), linear-gradient(to top, #5F59FF 50%, transparent 50%), linear-gradient(to top, #5F59FF 50%, transparent 50%)',
              backgroundPosition: 'left top, left bottom, left top, right top',
              backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
              backgroundSize: '19.5px 1px, 19.5px 1px, 1px 19.5px, 1px 19.5px',
            }
          : {
              height: '145px',
              borderRadius: '10px',
            }),
      }}
    >
      {children}
    </Box>
  );
};

const BoxTitleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '16px',
  marginTop: '16px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

interface Props {
  onDropImage: (event: DragEvent<HTMLDivElement>, formName: string) => void;
  setValue: (file: File) => void;
  info: string;
  name: string;
  value?: string | File | null;
}

export const DragAndDropImageInput = ({
  onDropImage,
  setValue,
  info,
  name,
  value,
}: Props) => {
  return (
    <ImageBox styled={!value} onDrop={(e) => onDropImage(e, name)}>
      <CardActionArea
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] text-primary-main"
        component="label"
        htmlFor={`file-input-${name}`}
      >
        <input
          id={`file-input-${name}`}
          type="file"
          name={`name-${name}`}
          hidden
          accept=".jpg, .jpeg, .png"
          // aria-invalid={imagesError ? 'true' : 'false'}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setValue(e.target.files[0]);
            }
          }}
        />
        {value ? (
          <Image
            src={typeof value === 'string' ? value : URL.createObjectURL(value)}
            fill
            alt="image"
            className="object-cover"
          />
        ) : (
          <div className="jutify-center flex flex-col items-center">
            <Plus size={24} style={{ color: '#5F59FF' }} />
            <BoxTitleText>{info}</BoxTitleText>
          </div>
        )}
      </CardActionArea>
    </ImageBox>
  );
};
