// src/lib/fetchWithAuth.ts

import { API_BASE_URL } from './config';
import { getToken } from './auth';

export async function fetchWithAuth<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const token = getToken();
  console.log('Token:', token);
  console.log('Request URL:', `${API_BASE_URL}${path}`);

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Type-safe check for FormData
  const body = options.body;
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return null;
      }

      const reason = await response.text();
      console.error('Fetch error:', reason, 'Status:', response.status);
      throw new Error(reason || response.statusText);
    }

    console.log('Fetch successful:', response.status);

    if (response.status === 204) {
      return null;
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Fetch failed:', err.message);
      throw err;
    } else {
      console.error('Fetch failed:', err);
      throw new Error('Unknown error occurred');
    }
  }
}
