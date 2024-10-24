import { forwardRef } from 'react';
import { Button, ButtonType } from './Button';

export interface AnswerButtonProps extends ButtonType {
  selected?: boolean;
}

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      {...props}
      className={`border border-solid border-text-secondary font-semibold hover:border-text-primary hover:text-text-primary ${className}`}
      ref={ref}
      variant="outlined"
    />
  ),
);

AnswerButton.displayName = 'AnswerButton';
