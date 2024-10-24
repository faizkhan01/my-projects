import { ContainedButton } from '@/ui-kit/buttons';
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  OutlinedInput,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { cx } from 'cva';
import { ReactNode, forwardRef, ComponentProps } from 'react';

const LightText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

const BoldText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: '500',
  color: theme.palette.text.primary,
}));

const Container = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  boxShadow:
    '0px 4px 53px rgba(0, 0, 0, 0.04), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0.02)',
  borderRadius: '10px',
  height: 'fit-content',

  [theme.breakpoints.down('sm')]: {
    boxShadow:
      '0px 4px 53px rgba(0, 0, 0, 0), 0px 0.500862px 6.63642px rgba(0, 0, 0, 0)',
  },
}));

const CartBox = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return <Container sx={sx}>{children}</Container>;
};

CartBox.Title = styled('h3')(({ theme }) => ({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '28px',
  color: theme.palette.text.primary,
  margin: 0,
}));

CartBox.TextRow = function TextRow({
  title,
  text,
  loading = false,
  sx,
  textColor = 'text.primary',
}: {
  title: ReactNode;
  text: ReactNode;
  loading?: boolean;
  sx?: SxProps<Theme>;
  textColor?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx,
      }}
    >
      <LightText>{title}</LightText>
      <LightText sx={{ color: textColor }}>
        {loading ? <Skeleton width="40px" height="18px" /> : text}
      </LightText>
    </Box>
  );
};

CartBox.TextRowBold = function TextRowBold({
  title,
  text,
  loading = false,
  sx,
}: {
  title: ReactNode;
  text: ReactNode;
  loading?: boolean;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx,
      }}
    >
      <BoldText>{title}</BoldText>
      <BoldText sx={{ fontWeight: '600', minWidth: '40px' }}>
        {loading ? <Skeleton width="40px" height="30px" /> : text}
      </BoldText>
    </Box>
  );
};

CartBox.Content = function Content({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Stack spacing="24px" sx={{ padding: '24px', ...sx }}>
      {children}
    </Stack>
  );
};

CartBox.Header = function Header({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <>
      <Box sx={{ padding: '24px', ...sx }}>{children}</Box>
      <Divider />
    </>
  );
};

CartBox.Footer = function Footer({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <>
      <Box
        sx={{
          padding: '0 24px',
        }}
      >
        <Divider />
      </Box>
      <Box
        sx={{
          padding: '24px',
          ...sx,
        }}
      >
        {children}
      </Box>
    </>
  );
};

CartBox.PromoCodeForm = function PromoCodeForm() {
  return (
    <FormControl>
      <FormLabel
        sx={{
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '16px',
          color: 'text.secondary',
        }}
        htmlFor="promotional-code"
      >
        Promotional Code
      </FormLabel>

      <Box
        sx={{
          display: 'flex',
        }}
      >
        <OutlinedInput
          id="promotional-code"
          sx={{ width: '100%', height: '40px' }}
        />
        <ContainedButton
          type="button"
          className="ml-4 h-[34px] min-w-[130px] text-[14px] font-normal sm:w-[136px] lg:w-[119px]"
        >
          Apply
        </ContainedButton>
      </Box>
    </FormControl>
  );
};

CartBox.MainButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof ContainedButton>
>(function MainButton({ className, ...props }, ref) {
  return (
    <ContainedButton
      className={cx('h-12 w-full text-[15px] font-semibold', className)}
      {...props}
      ref={ref}
    />
  );
});

export default CartBox;
