import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'blocked';
}

export async function listUsers(): Promise<UserDTO[]> {
  return fetchWithAuth<UserDTO[]>('/api/users/');
}

export async function createUser(body: {
  name: string;
  email: string;
  password: string;
  status: 'active' | 'blocked';
}): Promise<UserDTO> {
  return fetchWithAuth<UserDTO>('/api/users/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getUser(id: number): Promise<UserDTO> {
  return fetchWithAuth<UserDTO>(`/api/users/${id}`);
}

export async function updateUser(
  id: number,
  body: Partial<Omit<UserDTO, 'id'>>,
): Promise<UserDTO> {
  return fetchWithAuth<UserDTO>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: number): Promise<void> {
  return fetchWithAuth<void>(`/api/users/${id}`, { method: 'DELETE' });
}

export async function toggleUserStatus(id: number): Promise<UserDTO> {
  return fetchWithAuth<UserDTO>(`/api/users/${id}/toggle-status`, {
    method: 'POST',
  });
}