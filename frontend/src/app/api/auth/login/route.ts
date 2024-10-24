import { AUTH } from '@/constants/api';
import { cookiesKeys, getCookieExpiration } from '@/lib/cookies';
import { LoginResponseData } from '@/services/API/auth/signUp';
import { LoginBodyData } from '@/types/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body: LoginBodyData = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${AUTH.LOGIN}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });

  if (res.ok) {
    const data: LoginResponseData = await res.json();
    const cookieStore = cookies();

    if (data?.message.accessToken) {
      cookieStore.set(cookiesKeys.TOKEN, data?.message?.accessToken, {
        secure: true,
        httpOnly: true,
        expires: getCookieExpiration('TOKEN'),
      });

      return new Response(JSON.stringify(data), {
        status: 200,
      });
    }
  } else {
    return NextResponse.json(
      {
        ...(await res.json()),
      },
      {
        status: res.status,
      },
    );
  }
}
