import { API_BASE_URL } from '@/lib/config';

export interface CategoryDTO {
  id: number;
  name: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export async function listCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(`${API_BASE_URL}/api/categories/`);
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}

export async function createCategory(body: FormData): Promise<CategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/categories/`, {
    method: 'POST',
    body,
  });
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}

export async function getCategory(id: number): Promise<CategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`);
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}

export async function partialUpdateCategory(id: number, body: FormData): Promise<CategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PATCH',
    body,
  });
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
}

export async function toggleCategoryStatus(id: number): Promise<CategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}/toggle-status`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}