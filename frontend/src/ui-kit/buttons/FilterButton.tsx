import { forwardRef } from 'react';
import { Button, ButtonType } from './Button';
import { cx } from 'cva';

export interface FilterButtonProps extends ButtonType {
  selected?: boolean;
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ selected, className, ...props }, ref) => (
    <Button
      {...props}
      className={cx(
        'border border-solid',
        selected
          ? 'border-primary-main font-semibold text-text-primary hover:border-text-primary hover:text-text-primary'
          : 'border-[#EAECF4]  font-normal text-text-secondary hover:text-text-secondary',
        className,
      )}
      ref={ref}
      variant="outlined"
    />
  ),
);

FilterButton.displayName = 'FilterButton';
