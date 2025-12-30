import { apiCall, getToken, API_BASE_URL } from '@/lib/api';

export interface SubCategoryDTO {
  id: number;
  name: string;
  image: string | null;
  status: 'active' | 'inactive';
  category_id: number;
}

export async function listSubCategories(): Promise<SubCategoryDTO[]> {
  return await apiCall<SubCategoryDTO[]>('/api/subcategories/', {}, []);
}

export async function createSubCategory(body: FormData): Promise<SubCategoryDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/subcategories/`, {
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

export async function getSubCategory(id: number): Promise<SubCategoryDTO> {
  return await apiCall<SubCategoryDTO>(`/api/subcategories/${id}`);
}

export async function partialUpdateSubCategory(id: number, body: FormData): Promise<SubCategoryDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
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

export async function deleteSubCategory(id: number): Promise<void> {
  await apiCall(`/api/subcategories/${id}`, { method: 'DELETE' });
}

export async function toggleSubCategoryStatus(id: number): Promise<SubCategoryDTO> {
  return await apiCall<SubCategoryDTO>(`/api/subcategories/${id}/toggle-status`, { method: 'POST' });
}
