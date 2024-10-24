'use client';
import { ReactNode, forwardRef } from 'react';
import { Loader } from '../adornments/Loader';
import { VariantProps, cva } from 'cva';
import { cn } from '../utils';
import { Slot, Slottable } from '@radix-ui/react-slot';

const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'border-none',
    'rounded-[2px]',
    'min-h-[40px]',
    'shadow-none',
    'hover:cursor-pointer',
    'font-semibold',
    'px-4',
    'transition-colors',
    'justify-center',
    'duration-200',
    'gap-1',
    'text-base/none',
    'no-underline',
    'outline-none',
    'appearance-none',
    'aria-disabled:cursor-auto',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-1',
    'aria-disabled:text-[#96A2C1]',
    'aria-disabled:pointer-events-none',
    'm-0',
    'relative',
    'select-none',
    'align-middle',
  ],
  {
    variants: {
      variant: {
        contained: 'text-white aria-disabled:bg-[#EAECF4]',
        outlined:
          'border border-solid bg-transparent aria-disabled:border-[#EAECF4]',
        text: 'bg-transparent',
      },
      color: {
        primary: 'focus:ring-primary-main',
        success: 'focus:ring-success-main',
        error: 'focus:ring-error-main',
        inherit: 'focus:ring-inherit',
      },
      size: {
        medium: ['py-[11px]'],
        large: ['py-[15px]'],
      },
      fullWidth: {
        true: 'w-full',
      },
      uppercase: {
        true: 'uppercase',
      },
    },
    compoundVariants: [
      {
        variant: 'contained',
        color: 'primary',
        className: ['bg-primary-main hover:bg-primary-dark'],
      },
      {
        variant: 'contained',
        color: 'error',
        className: ['bg-error-main hover:bg-error-dark'],
      },
      {
        variant: 'contained',
        color: 'success',
        className: ['bg-success-main hover:bg-success-dark'],
      },
      {
        variant: 'outlined',
        color: 'primary',
        className: [
          ' border-primary-main hover:border-primary-dark',
          'text-primary-main',
          'hover:text-primary-dark',
        ],
      },
      {
        variant: 'outlined',
        color: 'error',
        className: [
          'border-error-main hover:border-error-dark',
          'text-error-main',
          'hover:text-error-dark',
        ],
      },
      {
        variant: 'outlined',
        color: 'success',
        className: [
          'border-success-main hover:border-success-dark',
          'text-success-main',
          'hover:text-success-dark',
        ],
      },
      {
        variant: 'text',
        color: 'primary',
        className: ['text-primary-main hover:text-primary-dark'],
      },
      {
        variant: 'text',
        color: 'error',
        className: ['text-error-main hover:text-error-dark'],
      },
      {
        variant: 'text',
        color: 'success',
        className: ['text-success-main hover:text-success-dark'],
      },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'text',
      size: 'medium',
    },
  },
);

export type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    loading?: boolean;
    href?: string;
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonType>(
  (
    {
      asChild,
      startIcon,
      endIcon,
      loading,
      className,
      fullWidth,
      variant,
      size,
      color,
      children,
      uppercase,
      ...props
    },
    ref,
  ): React.ReactElement | null => {
    let Component = asChild ? Slot : 'button';

    if (props?.href && !asChild) {
      Component = 'a';
    }

    if (loading) {
      props.disabled = true;
    }

    const renderIcon = () => {
      if (!startIcon && !loading) return null;

      return (
        <span className="flex items-center">
          {loading ? <Loader /> : startIcon}
        </span>
      );
    };

    return (
      <Component
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            className,
            size,
            color,
            fullWidth,
            uppercase,
          }),
        )}
        aria-disabled={props?.disabled || loading}
        tabIndex={props?.disabled || loading ? -1 : 0}
        type="button"
        {...props}
      >
        {renderIcon()}
        <Slottable>{children}</Slottable>
        {endIcon && endIcon}
      </Component>
    );
  },
);

Button.displayName = 'Button';
