import * as yup from 'yup';
import { RadioInput } from '@/ui-kit/inputs';
import { styled } from '@mui/material/styles';
import { handleAxiosError } from '@/lib/axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  RadioGroup,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/material';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { ContainedButton, OutlinedButton } from '@/ui-kit/buttons';
import { showSuccessSnackbar } from '@/hooks/stores/useGlobalSnackbar';
import { ModalCardContainer, ModalContainer } from '@/ui-kit/containers';
import { ControlledNumber } from '@/components/hookForm/ControlledNumber';
import { createSupportRequest } from '@/services/API/support-request';
import { UploadFile } from '../uploaders/Upload';
import { ControlledUpload } from '../hookForm';
import {
  onDropImageHandler,
  onRemoveImageHandler,
} from '@/utils/file-uploading';
import useProfile from '@/hooks/queries/useProfile';
import { useUserPreferencesStore } from '@/hooks/stores/useUserPreferencesStore';

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
}

export interface RequestModalForm {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  urgencyLevel: null | number;
  contactMethod: string;
  reason: string;
  images?: UploadFile[];
}

const formSchema = yup.object().shape({
  orderNumber: yup.string().required('Order Reference No is required'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),
  phone: yup.string().required('Phone Number is required'),
  description: yup.string().required('Description is required'),
  urgencyLevel: yup
    .number()
    .min(0, 'Urgency Level must not be less than 1')
    .required('Urgency Level is required'),
  contactMethod: yup
    .string()
    .required('Contact Method is required')
    .oneOf(['PHONE', 'EMAIL', 'BOTH'], 'Invalid Contact Method'),
  reason: yup
    .string()
    .required('Reason is required')
    .oneOf(
      ['NEW_ORDER', 'DELIVERY_OF_PRODUCT', 'BILLING_OR_CHANGE', 'OTHER'],
      'Invalid Reason',
    ),
  images: yup.array(),
});

const defaultValues = {
  orderReferenceNo: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  description: '',
  urgencyLevel: null,
  contactMethod: '',
  reason: '',
  images: [],
};

const MAX_IMAGES_QUANTITY = 10;

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '18px',
  marginBottom: '12px',
  color: theme.palette.text.primary,
}));

const SupportRequestModal = ({
  open,
  onClose,
}: RequestModalProps): JSX.Element => {
  const { profile } = useProfile();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<RequestModalForm>({
    defaultValues: {
      ...defaultValues,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
    },
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<RequestModalForm> = async (data) => {
    try {
      const response = await createSupportRequest(data);
      showSuccessSnackbar(response.message);
      reset();
      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const images = watch('images');

  const shippingCountry = useUserPreferencesStore(
    (state) => state.shippingCountry,
  );

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Support request">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '24px',
              marginInline: 'auto',
            }}
          >
            <ControlledFormInput
              id="orderReferenceNo"
              name="orderNumber"
              type="number"
              control={control}
              label="Order Reference No"
              placeholder="112954"
            />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <ControlledFormInput
                  id="firstName"
                  name="firstName"
                  control={control}
                  label="First Name"
                  placeholder="Caeleb"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ControlledFormInput
                  id="lastName"
                  name="lastName"
                  control={control}
                  label="Last Name"
                  placeholder="Dressel"
                />
              </Grid>
            </Grid>
            <ControlledFormInput
              id="email"
              name="email"
              type="email"
              control={control}
              label="Email"
              placeholder="caelebdressel@example.com"
            />
            <ControlledNumber
              id="phone"
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="409 757 5013"
              country={shippingCountry || undefined}
              international
            />

            <FormControl>
              <StyledFormLabel>Urgency Level</StyledFormLabel>
              <Controller
                name="urgencyLevel"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="space-y-3">
                    <RadioInput value={4} label="Today" />
                    <RadioInput value={3} label="In the next 48 hours" />
                    <RadioInput value={2} label="This week" />
                    <RadioInput value={1} label="Not Urgent" />
                    {errors.urgencyLevel && (
                      <Typography color="error" variant="caption">
                        {errors.urgencyLevel.message}
                      </Typography>
                    )}
                  </RadioGroup>
                )}
              />
            </FormControl>

            <FormControl>
              <StyledFormLabel>
                How would you like to be contacted?
              </StyledFormLabel>
              <Controller
                name="contactMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="space-y-3">
                    <RadioInput value="PHONE" label="By phone" />
                    <RadioInput value="EMAIL" label="By e-mail" />
                  </RadioGroup>
                )}
              />
              {errors.contactMethod && (
                <Typography color="error" variant="caption">
                  {errors.contactMethod.message}
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <StyledFormLabel>I’m having a problem with:</StyledFormLabel>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="space-y-3">
                    <RadioInput value={'NEW_ORDER'} label="New order" />
                    <RadioInput
                      value={'DELIVERY_OF_PRODUCT'}
                      label="Delivery of product"
                    />
                    <RadioInput
                      value={'BILLING_OR_CHANGE'}
                      label="Billing or charge"
                    />
                    <RadioInput value={'OTHER'} label="Other" />
                    {errors.reason && (
                      <Typography color="error" variant="caption">
                        {errors.reason.message}
                      </Typography>
                    )}
                  </RadioGroup>
                )}
              />
            </FormControl>

            <ControlledFormInput
              id="describe-your-problem"
              label="Describe Your Problem"
              type="text"
              rows={7}
              multiline={true}
              placeholder="Message"
              control={control}
              name="description"
            />

            <div className="flex flex-col">
              <StyledFormLabel>Add photo (optional)</StyledFormLabel>

              <ControlledUpload
                maxFiles={MAX_IMAGES_QUANTITY}
                description={`Up to ${MAX_IMAGES_QUANTITY} images in format PNG, JPG`}
                thumbnail
                multiple
                control={control}
                name="images"
                onDrop={onDropImageHandler(
                  'images',
                  getValues,
                  setValue,
                  setError,
                  10,
                )}
                onRemove={onRemoveImageHandler('images', images, setValue)}
                files={images ?? []}
              />
            </div>
          </Box>

          <div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:gap-6">
            <ContainedButton
              size="large"
              fullWidth
              type="submit"
              loading={isSubmitting}
            >
              Submit
            </ContainedButton>
            <OutlinedButton
              size="large"
              fullWidth
              onClick={() => handleClose()}
            >
              Cancel
            </OutlinedButton>
          </div>
        </form>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default SupportRequestModal;
