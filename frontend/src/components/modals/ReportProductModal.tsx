import { useMemo, useEffect } from 'react';
import { ModalContainer, ModalCardContainer } from '@/ui-kit/containers';
import ControlledReportCategorySelector from '../hookForm/ControlledReportCategorySelector';
import ControlledFormInput from '../hookForm/ControlledFormInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import ControlledReportReasonSelector from '../hookForm/ControlledReportReasonSelector';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleAxiosError } from '@/lib/axios';
import { createReport } from '@/services/API/productReports';
import useGlobalSnackbar from '@/hooks/stores/useGlobalSnackbar';
import useReportCategories from '@/hooks/queries/useReportCategories';
import { ContainedButton } from '@/ui-kit/buttons';

const REPORT_FORM_DEFAULT_VALUES = {
  message: '',
  categoryId: -1,
  reasonId: -1,
};

interface ReportFormData {
  message: string;
  categoryId: number;
  reasonId: number;
}

interface ReportProductProps {
  open: boolean;
  onClose: () => void;
  productId: number;
}

const formSchema = yup.object().shape({
  message: yup.string().required('Please provided a detailed reason'),
  categoryId: yup
    .number()
    .positive('Report Category is required')
    .required('Report Category is required'),
  reasonId: yup
    .number()
    .positive('Report Reason is required')
    .required('Report Reason is required'),
});

const ReportProductModal = ({
  open,
  onClose,
  productId,
}: ReportProductProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<ReportFormData>({
    defaultValues: REPORT_FORM_DEFAULT_VALUES,
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });
  const { reportCategories = [] } = useReportCategories();
  const openSnack = useGlobalSnackbar((state) => state.open);

  const onSubmit: SubmitHandler<ReportFormData> = async (data) => {
    const { message, reasonId } = data;
    try {
      const response = await createReport(message, reasonId, productId);
      openSnack({
        severity: 'success',
        message: response.message,
      });
      reset();
      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };
  const categoryId = watch('categoryId');

  const reasons = useMemo(
    () => reportCategories.find((rc) => rc.id === categoryId)?.reasons || [],
    [reportCategories, categoryId],
  );

  useEffect(() => {
    if (REPORT_FORM_DEFAULT_VALUES.categoryId !== categoryId)
      setValue('reasonId', -1);
  }, [categoryId, setValue]);

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalCardContainer title="Report This Item">
        <Typography
          mt={2}
          fontSize={16}
          lineHeight="24px"
          sx={{ maxWidth: '570px', textAlign: 'center' }}
        >
          All reports will remain anonymous and will processed by Only Latest as
          soon as possible. Please do not re-submit your report(s).
        </Typography>
        <Box>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '24px',
              maxWidth: {
                sm: '370px',
              },
              marginInline: 'auto',
            }}
          >
            <ControlledReportCategorySelector
              id="reportCategory"
              name="categoryId"
              control={control}
              label="Report Category"
              placeholder="Select a category"
            />
            <ControlledReportReasonSelector
              id="reportReason"
              name="reasonId"
              control={control}
              label="Reason for Report"
              placeholder="Select the reason"
              reasons={reasons}
            />
            <ControlledFormInput
              label="Detailed Reason"
              id="message"
              name="message"
              placeholder="Message"
              multiline
              rows={7}
              control={control}
            />
            <ContainedButton
              fullWidth
              type="submit"
              loading={isSubmitting}
              className="px-0 py-[15px]"
            >
              Send Report
            </ContainedButton>
          </Box>
        </Box>
      </ModalCardContainer>
    </ModalContainer>
  );
};

export default ReportProductModal;
