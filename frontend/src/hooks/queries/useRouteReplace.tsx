import { usePathname, useRouter } from 'next/navigation';
import { ParsedUrlQueryInput, stringify } from 'querystring';
import { useCallback } from 'react';

export const useRouteReplace = () => {
  const { replace: routerReplace, push: routerPush } = useRouter();
  const pathname = usePathname();

  const replace = useCallback(
    (queryParams: ParsedUrlQueryInput) => {
      routerReplace(`${pathname}?${stringify(queryParams)}`);
    },
    [routerReplace, pathname],
  );

  const push = useCallback(
    (queryParams: ParsedUrlQueryInput) => {
      routerPush(`${pathname}?${stringify(queryParams)}`);
    },
    [routerPush, pathname],
  );

  return { replace, push };
};
