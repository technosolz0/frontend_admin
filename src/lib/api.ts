import { API_BASE_URL } from './config';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),  // ✅ fixed line
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Invalid credentials');
  }

  return res.json(); // returns { access_token, token_type, admin: {...} }
}
