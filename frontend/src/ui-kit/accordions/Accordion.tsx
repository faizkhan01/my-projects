import {
  Root,
  Item as RadixItem,
  Content as RadixContent,
  Header as RadixHeader,
  Trigger as RadixTrigger,
} from '@radix-ui/react-accordion';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../utils';
import { CaretDown } from '@phosphor-icons/react';

export const Accordion = (props: ComponentPropsWithoutRef<typeof Root>) => (
  <Root
    {...(props.type === 'single' && {
      collapsible: true,
    })}
    {...props}
  />
);

Accordion.Item = forwardRef<
  React.ElementRef<typeof RadixItem>,
  React.ComponentPropsWithoutRef<typeof RadixItem>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <RadixItem
      ref={ref}
      className={cn('border-b border-solid border-[#EAECF4]', className)}
      {...props}
    />
  );
});

Accordion.Summary = forwardRef<
  React.ElementRef<typeof RadixTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixTrigger> & {
    disableExpandIcon?: boolean;
    expandIcon?: React.ReactNode;
    expandPosition?: 'left' | 'right';
    expandRotation?: 'bottom-to-up' | 'right-to-down';
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  }
>(function AccordionSummary(
  {
    className,
    children,
    expandIcon,
    expandPosition = 'right',
    expandRotation = 'bottom-to-up',
    disableExpandIcon = false,
    heading = 'p',
    ...props
  },
  ref,
) {
  const Chevron = disableExpandIcon ? null : (
    <div className="expand-wrapper text-black transition-transform duration-300">
      {expandIcon || <CaretDown size={16} weight="bold" />}
    </div>
  );

  const HeadingComp = heading;

  return (
    <RadixHeader className="m-0 flex" asChild>
      <HeadingComp>
        <RadixTrigger
          ref={ref}
          className={cn(
            'flex flex-1 items-center bg-transparent text-[14px] font-medium transition-all',
            'min-h-[44px] cursor-pointer gap-2 p-0 text-left text-text-primary',
            expandPosition === 'left' ? 'justify-start' : 'justify-between',
            expandRotation === 'bottom-to-up' &&
              '[&[data-state=open]>.expand-wrapper]:rotate-180',
            expandRotation === 'right-to-down' &&
              '[&[data-state=closed]>.expand-wrapper]:-rotate-90',
            className,
          )}
          {...props}
        >
          {expandPosition === 'left' && Chevron}
          {children}
          {expandPosition === 'right' && Chevron}
        </RadixTrigger>
      </HeadingComp>
    </RadixHeader>
  );
});
Accordion.Details = forwardRef<
  React.ElementRef<typeof RadixContent>,
  React.ComponentPropsWithoutRef<typeof RadixContent> & {
    disablePadding?: boolean;
  }
>(function AccordionDetails(
  { className, children, disablePadding, ...props },
  ref,
) {
  return (
    <RadixContent
      ref={ref}
      className={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className,
      )}
      {...props}
    >
      <div className={disablePadding ? '' : 'pb-4 pt-0'}>{children}</div>
    </RadixContent>
  );
});
