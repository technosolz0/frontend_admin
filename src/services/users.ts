import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'blocked';
}

export async function listUsers(): Promise<UserDTO[]> {
  const data = await fetchWithAuth<UserDTO[]>('/api/users/');
  return data ?? [];
}

export async function createUser(body: {
  name: string;
  email: string;
  password: string;
  status: 'active' | 'blocked';
}): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>('/api/users/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!data) throw new Error('Failed to create user');
  return data;
}

export async function getUser(id: number): Promise<UserDTO> {
  const data = await fetchWithAuth<UserDTO>(`/api/users/${id}`);
  if (!data) throw new Error(`User with id ${id} not found`);
  return data;
}

export async function updateUser(
  id: number,
  body: Partial<Omit<UserDTO, 'id'>>,
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
