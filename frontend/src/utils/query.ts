import { ReadonlyURLSearchParams } from 'next/navigation';
import queryString, { Stringifiable, StringifiableRecord } from 'query-string';

export const getNewSearchParams = (
  oldParams: ReadonlyURLSearchParams,
  newParams: Record<string, Stringifiable>,
  pathname?: string,
) => {
  const query: StringifiableRecord = {
    ...Object.fromEntries(oldParams),
    ...newParams,
  };
  if (pathname) {
    return queryString.stringifyUrl({
      url: pathname,
      query,
    });
  }
  return queryString.stringify(query);
};
