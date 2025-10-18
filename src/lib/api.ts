
import { saveToken } from './auth';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  admin?: Record<string, unknown>;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.serwex.in'}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    console.error('Login failed:', res.status, res.statusText);
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }
console.log('Login response:', res);
  const data: LoginResponse = await res.json();
  saveToken(data.access_token);
  return data;
}
export { saveToken };
