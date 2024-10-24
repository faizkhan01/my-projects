import { twMerge } from 'tailwind-merge';
import { cx, CxOptions } from 'cva';

export const cn = (...inputs: CxOptions) => {
  return twMerge(cx(...inputs));
};
