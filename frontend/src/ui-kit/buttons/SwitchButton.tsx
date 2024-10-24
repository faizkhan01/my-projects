import MuiSwitch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const Switch = styled(MuiSwitch)(() => ({
  width: 30,
  height: 18,
  padding: 0,
}));

type Props = SwitchProps;

export const SwitchButton = forwardRef(function SwitchButton(
  props: Props,
  ref,
) {
  return <Switch {...props} inputRef={ref} />;
});
