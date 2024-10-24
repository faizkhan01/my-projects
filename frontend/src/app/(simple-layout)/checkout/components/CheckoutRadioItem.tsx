import { FormControlLabel, Radio, Typography } from '@mui/material';
import { ReactNode } from 'react';

export const RadioItemContainer = ({
  children,
  selected,
}: {
  children: ReactNode;
  selected?: boolean;
}) => {
  return (
    <div
      className={`w-full rounded-[10px] border border-solid ${
        selected ? 'border-primary-main' : 'border-[#96A2C1]'
      }`}
    >
      {children}
    </div>
  );
};

export const RadioItem = ({
  selected,
  text,
  textClassName,
  value,
  sideContent,
}: {
  selected?: boolean;
  text: string;
  textClassName?: string;
  value?: string;
  sideContent?: ReactNode;
}) => {
  return (
    <FormControlLabel
      className="m-0 w-full"
      control={<Radio checked={selected} value={value} />}
      label={
        <div className="flex w-full items-center gap-2">
          <Typography
            className={`${
              selected ? 'text-[#333E5C]' : 'text-[#96A2C1]'
            } ${textClassName}`}
            component="span"
          >
            {text}
          </Typography>
          {sideContent}
        </div>
      }
    />
  );
};
