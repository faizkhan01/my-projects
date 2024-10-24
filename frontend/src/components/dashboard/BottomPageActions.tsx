import Link from 'next/link';
import { Box } from '@mui/material';
import { OutlinedButton, ContainedButton } from '@/ui-kit/buttons';
import { styled } from '@mui/material/styles';

interface BottomPageActionsProps {
  backHref: string;
  onClickSave?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  padding: '24px',
  borderRadius: '10px',
}));

export const BottomPageActions = ({
  backHref,
  onClickSave,
  loading = false,
  disabled = false,
}: BottomPageActionsProps) => {
  return (
    <StyledBox>
      <div className="flex flex-wrap items-center justify-end gap-5">
        <Link href={backHref} legacyBehavior passHref>
          <OutlinedButton
            size="large"
            className="w-full max-w-full sm:max-w-[130px]"
            type="button"
          >
            Back
          </OutlinedButton>
        </Link>
        <ContainedButton
          size="large"
          className="w-full max-w-full sm:max-w-[130px]"
          type={onClickSave ? 'button' : 'submit'}
          onClick={onClickSave}
          loading={loading}
          disabled={disabled}
        >
          Save
        </ContainedButton>
      </div>
    </StyledBox>
  );
};
