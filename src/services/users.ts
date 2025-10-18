// import { fetchWithAuth } from '@/lib/fetchWithAuth';

// export interface UserDTO {
//   id: number;
//   name: string;
//   email: string;
//   status: 'active' | 'blocked';
// }

// export async function listUsers(): Promise<UserDTO[]> {
//   const data = await fetchWithAuth<UserDTO[]>('/api/users/');
//   return data ?? [];
// }

// export async function createUser(body: {
//   name: string;
//   email: string;
//   password: string;
//   status: 'active' | 'blocked';
// }): Promise<UserDTO> {
//   const data = await fetchWithAuth<UserDTO>('/api/users/', {
//     method: 'POST',
//     body: JSON.stringify(body),
//   });
//   if (!data) throw new Error('Failed to create user');
//   return data;
// }

// export async function getUser(id: number): Promise<UserDTO> {
//   const data = await fetchWithAuth<UserDTO>(`/api/users/${id}`);
//   if (!data) throw new Error(`User with id ${id} not found`);
//   return data;
// }

// export async function updateUser(
//   id: number,
//   body: Partial<Omit<UserDTO, 'id'>>,
// ): Promise<UserDTO> {
//   const data = await fetchWithAuth<UserDTO>(`/api/users/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(body),
//   });
//   if (!data) throw new Error(`Failed to update user with id ${id}`);
//   return data;
// }

// export async function deleteUser(id: number): Promise<void> {
//   await fetchWithAuth<void>(`/api/users/${id}`, { method: 'DELETE' });
// }

// export async function toggleUserStatus(id: number): Promise<UserDTO> {
//   const data = await fetchWithAuth<UserDTO>(`/api/users/${id}/toggle-status`, {
//     method: 'POST',
//   });
//   if (!data) throw new Error(`Failed to toggle status for user with id ${id}`);
//   return data;
// }


import { API_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  status: 'active' | 'blocked';
  is_superuser?: boolean;
  profile_pic?: string;
  last_login_at?: string;
  last_login_ip?: string;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  mobile: string;
  password: string;
  profile_pic?: string;
  new_fcm_token?: string;
  device_id?: string;
  device_type?: string;
  os_version?: string;
  app_version?: string;
}

export interface OTPVerifyDTO {
  email: string;
  otp: string;
}

export interface OTPResendDTO {
  email: string;
}

export interface PasswordResetRequestDTO {
  email: string;
}

export interface PasswordResetConfirmDTO {
  email: string;
  otp: string;
  new_password: string;
}

export interface UserUpdateDTO {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  status?: 'active' | 'blocked';
  profile_pic?: string;
  new_fcm_token?: string;
  device_id?: string;
  device_type?: string;
  os_version?: string;
  app_version?: string;
}

export interface AuthResponseDTO {
  access_token: string;
  token_type: string;
  user: UserDTO;
}

export interface RegisterResponseDTO {
  success: boolean;
  message: string;
  user?: UserDTO;
}

export interface GenericResponseDTO {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export async function registerUserWithOTP(body: UserCreateDTO): Promise<RegisterResponseDTO> {
  const res = await fetch(`${API_BASE_URL}/api/users/register-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function verifyUserOTP(data: OTPVerifyDTO): Promise<AuthResponseDTO> {
  const res = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function resendUserOTP(data: OTPResendDTO): Promise<GenericResponseDTO> {
  const res = await fetch(`${API_BASE_URL}/api/users/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function requestPasswordReset(request: PasswordResetRequestDTO): Promise<GenericResponseDTO> {
  const res = await fetch(`${API_BASE_URL}/api/users/password-reset/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function confirmPasswordReset(confirm: PasswordResetConfirmDTO): Promise<GenericResponseDTO> {
  const res = await fetch(`${API_BASE_URL}/api/users/password-reset/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(confirm),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getCurrentUser(): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>('/api/users/me');
  if (!data) throw new Error('Failed to fetch current user');
  return data;
}

export async function listUsers(skip: number = 0, limit: number = 10): Promise<UserDTO[]> {
  try {
    const url = new URL('/api/users/', new URL(API_BASE_URL));
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', limit.toString());
    const data = await fetchWithAuth<UserDTO[]>(url.pathname + url.search);
    return data ?? [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUser(token: string, id: number): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>(`/api/users/${id}`);
  if (!data) throw new Error(`User with id ${id} not found`);
  return data;
}

export async function updateUser(
  id: number,
  body: UserUpdateDTO,
): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!data) throw new Error(`Failed to update user with id ${id}`);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await fetchWithAuth<void>(`/api/users/${id}`, { method: 'DELETE' });
}

export async function toggleUserStatus(id: number): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>(`/api/users/${id}/toggle-status`, {
    method: 'POST',
  });
  if (!data) throw new Error(`Failed to toggle status for user with id ${id}`);
  return data;
}

export async function updateFCMToken(
  new_fcm_token: string,
  device_id: string,
  device_type?: string,
  os_version?: string,
  app_version?: string,
): Promise<GenericResponseDTO> {
  const body = { new_fcm_token, device_id, device_type, os_version, app_version };
  const data = await fetchWithAuth<GenericResponseDTO>('/api/users/me/fcm-token', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!data) throw new Error('Failed to update FCM token');
  return data;
}

export async function updateProfilePic(profile_pic: string): Promise<GenericResponseDTO> {
  const data = await fetchWithAuth<GenericResponseDTO>('/api/users/me/profile-pic', {
    method: 'POST',
    body: JSON.stringify({ profile_pic }),
  });
  if (!data) throw new Error('Failed to update profile picture');
  return data;
}

export async function clearProfilePic(): Promise<GenericResponseDTO> {
  const data = await fetchWithAuth<GenericResponseDTO>('/api/users/me/profile-pic', {
    method: 'DELETE',
  });
  if (!data) throw new Error('Failed to clear profile picture');
  return data;
}

export async function getVendorsAndCharges(category_id: number, subcategory_id: number): Promise<{ vendors: Array<{ id: number; name: string; charges: number }>; total: number }> {
  const data = await fetchWithAuth<{ vendors: Array<{ id: number; name: string; charges: number }>; total: number }>(`/api/users/vendors-charges/${category_id}/${subcategory_id}`);
  if (!data) throw new Error('Failed to fetch vendors and charges');
  return data;
}
