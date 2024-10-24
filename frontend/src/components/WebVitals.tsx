'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // eslint-disable-next-line no-console
    console.log(metric);
  });

  return null;
}
