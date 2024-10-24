import { forwardRef } from 'react';
import { Button, ButtonType } from './Button';

export const ContainedButton = forwardRef<HTMLButtonElement, ButtonType>(
  (props, ref) => (
    <Button type="button" {...props} ref={ref} variant="contained" />
  ),
);

ContainedButton.displayName = 'ContainedButton';
