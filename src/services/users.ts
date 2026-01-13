

import { apiCall } from '@/lib/api';

// Types based on backend API
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  status: 'active' | 'blocked';
  is_superuser?: boolean;
  profile_pic?: string;
  last_login_at?: string;
  is_verified?: boolean;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  filters_applied: {
    search?: string;
    status?: string;
  };
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
  user: UserDTO;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

// Admin User Management APIs (matching backend routes)
export async function listUsers(
  skip: number = 0,
  limit: number = 10,
  search?: string,
  status_filter?: string
): Promise<UserListResponse> {
  let url = `/api/users/?skip=${skip}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (status_filter) url += `&status_filter=${status_filter}`;

  return await apiCall<UserListResponse>(url, {}, {
    success: true,
    message: 'No users found',
    users: [],
    total: 0,
    page: 1,
    limit,
    total_pages: 0,
    filters_applied: {}
  });
}

export async function getUserById(userId: number): Promise<UserDTO> {
  return await apiCall<UserDTO>(`/api/users/${userId}`);
}

export async function updateUser(userId: number, data: Partial<UserDTO>): Promise<UserUpdateResponse> {
  return await apiCall<UserUpdateResponse>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: number): Promise<GenericResponse> {
  return await apiCall<GenericResponse>(`/api/users/${userId}`, {
    method: 'DELETE',
  });
}

export async function toggleUserStatus(userId: number): Promise<UserUpdateResponse> {
  return await apiCall<UserUpdateResponse>(`/api/users/${userId}/toggle-status`, {
    method: 'POST',
  });
}

// Legacy functions (keeping for compatibility)
export async function getUser(token: string, id: number): Promise<UserDTO> {
  return getUserById(id);
}

export async function getCurrentUser(): Promise<UserDTO> {
  return await apiCall<UserDTO>(`/api/users/me`);
}
