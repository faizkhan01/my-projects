import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { ControlledFormSelect } from '../hookForm/ControlledFormSelect';

const processingTimeOptions = [
  { label: '1-2 business days', from: 1, to: 2 },
  { label: '3-5 business days', from: 3, to: 5 },
  { label: '1-2 weeks', from: 1 * 7, to: 2 * 7 },
  { label: '2-3 weeks', from: 2 * 7, to: 3 * 7 },
  { label: '3-4 weeks', from: 3 * 7, to: 4 * 7 },
  { label: '4-6 weeks', from: 4 * 7, to: 6 * 7 },
];

const ProcessingTimeSelector = ({
  defaultMinDays,
  minDays: from,
  maxDays: to,
  control,
  setValue,
  prefix = '',
}: {
  prefix?: string;
  defaultMinDays?: number;
  minDays: number;
  maxDays: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
}) => {
  const processingValue = useMemo(() => {
    const selectedProcessing = processingTimeOptions.find(
      (o) => o.from === from && o.to === to,
    );

    return selectedProcessing
      ? `${selectedProcessing?.from}-${selectedProcessing?.to}`
      : defaultMinDays;
  }, [defaultMinDays, from, to]);

  const minName = `${prefix}minProcessingDays`;
  const maxName = `${prefix}maxProcessingDays`;

  return (
    <ControlledFormSelect
      id="minProcessingDays"
      name={minName}
      SelectProps={{
        displayEmpty: true,
      }}
      label="Processing time"
      value={processingValue}
      // onChange is needed to avoid issues with react-hook-form
      onChange={() => null}
      control={control}
      helperText="The time it takes to prepare an order for shipping"
    >
      <MenuItem disabled value={defaultMinDays}>
        Select processing time
      </MenuItem>
      {processingTimeOptions.map((o) => (
        <MenuItem
          key={o.label}
          value={`${o.from}-${o.to}`}
          onClick={() => {
            setValue(minName, o.from, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue(maxName, o.to, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          {o.label}
        </MenuItem>
      ))}
    </ControlledFormSelect>
  );
};

export default ProcessingTimeSelector;
