import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const getOrigin = (headers: ReadonlyHeaders): string => {
  // sometimes it returns https,http instead of https
  const proto = headers.get('x-forwarded-proto')?.split(',')[0] || 'http';
  const host = headers.get('host');

  return `${proto}://${host}`;
};

export const getPathName = (headers: ReadonlyHeaders): string | null => {
  return headers.get('x-invoke-path') || null;
};

export const getFullUrl = (headers: ReadonlyHeaders): string => {
  return `${getOrigin(headers)}${getPathName(headers)}`;
};
