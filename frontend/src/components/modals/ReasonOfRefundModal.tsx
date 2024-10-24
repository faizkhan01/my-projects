import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import ControlledReturnReasonSelector from '../hookForm/ControlledReturnReasonSelector';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import { Box, Typography, Stack } from '@mui/material';
import { ControlledUpload } from '../hookForm';
import { UploadFile } from '../uploaders/Upload';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FileRejection } from 'react-dropzone';

const MainText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '18px',
  marginBottom: '16px',
  color: theme.palette.text.primary,
}));

const ProductText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  width: '258px',
  height: '44px',
  color: theme.palette.text.primary,

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    width: '172px',
    height: '34px',
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  height: '96px',
  width: '96px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: theme.palette.grey[50],

  [theme.breakpoints.down('sm')]: {
    width: '80px',
    height: '80px',
  },
}));

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'start',
    marginBottom: '16px',
  },
}));

const CircleWithText = styled(Box)(() => ({
  gap: '8px',
  display: 'flex',
  alignItems: 'center',
}));

const CircleBox = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,

  [theme.breakpoints.down('sm')]: {
    width: 6,
    height: 6,
  },
}));

const CircleText = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  color: theme.palette.text.primary,
}));

interface ReturnProductProps {
  open: boolean;
  onClose: (data: ReturnProductForm | null) => void;
  item: {
    id: number;
    name: string;
    image: string;
  };
}

export interface ReturnProductForm {
  images: UploadFile[] | null;
  reasonId: number | null;
  description: string;
}

const FormSchema = yup.object({
  reasonId: yup.number().required('Required'),
  description: yup.string().required('Required'),
  images: yup
    .array()
    .of(yup.mixed().required('Please upload an image'))
    .required('Please upload an image'),
});

const MAX_IMAGES_QUANTITY = 10;

const defaultValues = {
  description: '',
  images: [],
  reasonId: null,
};

const ReasonOfRefundModal = ({
  open,
  onClose,
  item,
}: ReturnProductProps): JSX.Element => {
  const { control, watch, setValue, setError, getValues, handleSubmit, reset } =
    useForm<ReturnProductForm>({
      resolver: yupResolver(FormSchema),
      defaultValues,
    });

  const onDropImage = (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    const files = getValues('images');

    for (const file of Array.from(acceptedFiles)) {
      if (!file.type.includes('image')) {
        setError('images', {
          type: 'manual',
          message: 'Only images are allowed',
        });
        setValue('images', null);
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
      return setError('images', {
        type: 'manual',
        message: `You can't upload more than ${MAX_IMAGES_QUANTITY} images`,
      });
    }

    setValue('images', totalFiles, {
      shouldValidate: true,
    });
  };

  const images = watch('images');

  const onSubmit: SubmitHandler<ReturnProductForm> = (data) => {
    onClose(data);
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose(null);
  };

  return (
    <ModalContainer open={open} onClose={() => handleClose()}>
      <ModalCardContainer title="State The Reason For Return">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '24px',
              maxWidth: '370px',
              marginInline: 'auto',
            }}
          >
            <FlexBox>
              <ProductImageContainer>
                <Image
                  src={item.image}
                  alt="product_image"
                  fill
                  className="object-cover"
                />
              </ProductImageContainer>
              <Box>
                <ProductText>{item.name}</ProductText>
              </Box>
            </FlexBox>
            <ControlledReturnReasonSelector
              id="return-reason"
              name="reasonId"
              control={control}
              label="The reason for the return"
              placeholder="Select the reason"
            />
            <ControlledFormInput
              id="describe-the-problem"
              label="Describe the problem"
              type="text"
              rows={7}
              multiline={true}
              placeholder="Message"
              control={control}
              name="description"
            />

            <Box>
              <MainText>You must add a photo to the application:</MainText>
              <Stack
                direction="column"
                spacing={{
                  xs: '8px',
                  md: '16px',
                }}
              >
                <CircleWithText>
                  <CircleBox />
                  <CircleText>
                    General view of the factory packaging (if any)
                  </CircleText>
                </CircleWithText>
                <CircleWithText>
                  <CircleBox />
                  <CircleText>General view of the product</CircleText>
                </CircleWithText>
                <CircleWithText>
                  <CircleBox />
                  <CircleText>Close-up view of the fault</CircleText>
                </CircleWithText>
                <CircleWithText>
                  <CircleBox />
                  <CircleText>The marking on the package (if any)</CircleText>
                </CircleWithText>
                <CircleWithText>
                  <CircleBox />
                  <CircleText>
                    Factory markings (SQ, QR, ...) (if any)
                  </CircleText>
                </CircleWithText>
              </Stack>
            </Box>

            <ControlledUpload
              maxFiles={MAX_IMAGES_QUANTITY}
              description={`Up to ${MAX_IMAGES_QUANTITY} images in format PNG, JPG`}
              thumbnail
              multiple
              control={control}
              name="images"
              onDrop={onDropImage}
              onRemove={(file) => {
                setValue('images', images?.filter((f) => f != file) ?? []);
              }}
              files={images ?? []}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: {
                  xs: '12px',
                  md: '24px',
                },
              }}
            >
              <ContainedButton
                size="large"
                className="w-full max-w-full sm:max-w-[173px]"
                type="submit"
              >
                Confirm
              </ContainedButton>
              <OutlinedButton
                size="large"
                className="w-full max-w-full sm:max-w-[173px]"
                onClick={() => handleClose()}
              >
                Cancel
              </OutlinedButton>
            </Box>
          </Box>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default ReasonOfRefundModal;
