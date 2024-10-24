import { useAuthStore } from '@/hooks/stores/useAuthStore';
import queryString from 'query-string';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface RequestAPIOptions extends RequestInit {
  params?: Record<string, unknown>;
}

export const requestAPI = async <T>(
  path: Parameters<typeof fetch>[0],
  options?: RequestAPIOptions,
) => {
  const state = useAuthStore.getState();
  const accessToken = state.token;

  return fetch(
    `${baseURL}${path}
${options?.params ? '?' + queryString.stringify(options?.params) : ''}
`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options?.headers,
      },
    },
  )
    .then(async (res) => {
      const data = (await res.json()) as Promise<T>;
      if (!res.ok) throw data;
      return data as T;
    })
    .catch((err) => {
      throw err;
    });
};
