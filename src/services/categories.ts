import { apiCall, getToken, API_BASE_URL } from '@/lib/api';

export interface CategoryDTO {
  id: number;
  name: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export async function listCategories(): Promise<CategoryDTO[]> {
  return await apiCall<CategoryDTO[]>('/api/categories/', {}, []);
}

export async function createCategory(body: FormData): Promise<CategoryDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/categories/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  return response.json();
}

export async function getCategory(id: number): Promise<CategoryDTO> {
  return await apiCall<CategoryDTO>(`/api/categories/${id}`);
}

export async function partialUpdateCategory(id: number, body: FormData): Promise<CategoryDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  await apiCall(`/api/categories/${id}`, { method: 'DELETE' });
}

export async function toggleCategoryStatus(id: number): Promise<CategoryDTO> {
  return await apiCall<CategoryDTO>(`/api/categories/${id}/toggle-status`, {
    method: 'POST',
  });
}
