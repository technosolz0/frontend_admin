
import { API_BASE_URL } from './config';

export { API_BASE_URL };

// Types
export interface LoginResponse {
  access_token: string;
  token_type: string;
  admin?: {
    id: number;
    name: string;
    email: string;
    is_superuser: boolean;
  };
}

// Helper functions
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

// Login function
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  return response.json();
}

// Main API call function with error handling
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    // Handle authentication errors
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    // Handle network errors gracefully
    if (response.status === 0 || !response.ok) {
      console.warn(`API call failed for ${endpoint}:`, response.status, response.statusText);
      return fallbackData as T;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Network error for ${endpoint}:`, error);
    return fallbackData as T;
  }
}
