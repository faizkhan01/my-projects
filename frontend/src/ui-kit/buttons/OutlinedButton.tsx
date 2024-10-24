import { forwardRef } from 'react';
import { Button, ButtonType } from './Button';

export const OutlinedButton = forwardRef<HTMLButtonElement, ButtonType>(
  (props, ref) => (
    <Button type="button" {...props} ref={ref} variant="outlined" />
  ),
);

OutlinedButton.displayName = 'OutlinedButton';
