import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  UserPreferenciesCookie,
  cookiesKeys,
  getCookieExpiration,
} from '@/lib/cookies';
import routes from '@/constants/routes';
import { AUTH } from '@/constants/api';
import type { Country } from 'react-phone-number-input';
import { isCurrencySupported } from './utils/currency';
import {
  ResponseCookies,
  RequestCookies,
} from 'next/dist/server/web/spec-extension/cookies';

const redirectHome = (req: NextRequest, url: string) =>
  setRequiredCookies(req, NextResponse.redirect(new URL('/', url)));

const defaultCookieOptions = {
  httpOnly: false,
  secure: true,
};

/** https://github.com/vercel/next.js/issues/49442#issuecomment-1679807704
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

const getCurrencyData = (
  request: NextRequest,
  preferencies: UserPreferenciesCookie | null,
): Promise<string> | string => {
  if (
    preferencies?.currency_code &&
    isCurrencySupported(preferencies.currency_code)
  ) {
    return preferencies.currency_code;
  }

  const host = request.headers.get('host');

  const afterDot = host?.split('.').at(-1);

  switch (afterDot) {
    case 'com':
      return 'USD';
    case 'ca':
      return 'CAD';
    default:
      return 'USD';
  }
};

const getLocationData = (
  request: NextRequest,
  preferencies: UserPreferenciesCookie | null,
): Promise<Country> | Country => {
  if (preferencies?.country_code) {
    return preferencies.country_code;
  }

  const isTest = process.env.NODE_ENV === 'test';
  let ip: string | undefined =
    request?.ip ??
    request?.headers.get('x-real-ip') ??
    request?.headers?.get?.('x-forwarded-for')?.split(',').at(0);
  // In case there is not IP or something else happen we set it to a google dns ip to get a real location
  // in this case in the US
  const defaultIp = '8.8.8.8';

  if (!ip) {
    ip = defaultIp;
  }

  let location: UserPreferenciesCookie['country_code'] = 'US';

  if (!preferencies?.country_code && ip && !isTest) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`, {
      method: 'POST',
      body: JSON.stringify({ ip }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((r) => r.json())
      .then(
        (data: {
          data: {
            country: {
              isoCode: Country;
            };
          } | null;
          success: boolean;
        }) => {
          if (data?.data?.country.isoCode) {
            location = data.data.country.isoCode;
          }

          return location;
        },
      )
      .catch((error) => {
        console.error(error);
        return location;
      });
  }

  return location;
};

const setRequiredCookies = async (req: NextRequest, res: NextResponse) => {
  const cookie = req.cookies.get(cookiesKeys.USER_PREFERENCIES)?.value;

  const preferencies = cookie
    ? (JSON.parse(cookie) as UserPreferenciesCookie)
    : null;

  const [location, currency] = await Promise.all([
    getLocationData(req, preferencies),
    getCurrencyData(req, preferencies),
  ]);

  const data: UserPreferenciesCookie = {
    country_code: location,
    currency_code: currency,
  };

  res.cookies.set(cookiesKeys.USER_PREFERENCIES, JSON.stringify(data), {
    ...defaultCookieOptions,
    expires: getCookieExpiration('USER_PREFERENCIES'),
  });

  applySetCookie(req, res);

  return res;
};

export async function middleware(request: NextRequest) {
  const { nextUrl, url } = request;

  if (nextUrl.pathname.startsWith(routes.DASHBOARD.INDEX)) {
    const token = request.cookies.get(cookiesKeys.TOKEN);

    if (!token) {
      return redirectHome(request, url);
    }

    return setRequiredCookies(request, NextResponse.next());
  }

  if (nextUrl.pathname === routes.AUTH.CONFIRM_EMAIL) {
    const code = nextUrl.searchParams.get('code');
    const email = nextUrl.searchParams.get('email');

    if (!code || !email) {
      return redirectHome(request, url);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${AUTH.CONFIRM_EMAIL}`,
        {
          method: 'POST',
          body: JSON.stringify({ token: code, email: email }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );

      if (!res.ok) {
        return redirectHome(request, url);
      }

      const response = NextResponse.redirect(
        new URL(`/?login=${code || email}`, url),
      );
      response.cookies.delete(cookiesKeys.TOKEN);

      return setRequiredCookies(request, response);
    } catch (error) {
      console.error(error);
    }
  }

  if (nextUrl.pathname === routes.AUTH.CONFIRM_REGISTER) {
    const code = nextUrl.searchParams.get('code');

    if (!code) {
      return redirectHome(request, url);
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${AUTH.CONFIRM_REGISTRATION}`,
        {
          method: 'POST',
          body: JSON.stringify({ registrationCode: code }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      if (!res.ok) {
        return redirectHome(request, url);
      }

      const data = await res.json();

      const response = NextResponse.redirect(
        new URL(routes.DASHBOARD.INDEX, url),
      );
      response.cookies.set(cookiesKeys.TOKEN, data.accessToken, {
        expires: getCookieExpiration('TOKEN'),
      });

      return setRequiredCookies(request, response);
    } catch (error) {
      console.error(error);
    }
  }

  return setRequiredCookies(request, NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
