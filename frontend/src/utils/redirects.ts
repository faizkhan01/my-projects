import routes from '@/constants/routes';
import { ReadonlyURLSearchParams, redirect } from 'next/navigation';

export const dashboardIndexRedirect = () => {
  return redirect(routes.DASHBOARD.INDEX);
};

// function that takes the actual path and the new page
// and returns the redirect string so the new page can return to the actual path
// it can be used after the user logs in or logs out
export const redirectTo = (actualPath: string, newPage: string): string => {
  return `${newPage}?redirectTo=${encodeURIComponent(actualPath)}`;
};

// function that returns the redirectTo query param
export const getRedirectTo = (
  params: ReadonlyURLSearchParams | URLSearchParams,
): string => {
  return params?.get('redirectTo') as string;
};
