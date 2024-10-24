import {
  SubscribeButton,
  SubscribeInput,
} from '@/components/subscribe/SubscribeTextField';
import { SxProps, Theme } from '@mui/material/styles';

interface TextFieldProps {
  sx?: SxProps<Theme>;
}

const FooterTextField = ({ sx }: TextFieldProps) => (
  <div className="flex max-h-[50px]">
    <SubscribeInput sx={sx} placeholder="Enter your email" />
    <SubscribeButton>Subscribe</SubscribeButton>
  </div>
);

export default FooterTextField;
