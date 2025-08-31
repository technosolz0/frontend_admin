import { API_BASE_URL } from '@/lib/config';

export interface SubCategoryDTO {
  id: number;
  name: string;
  image: string | null;
  status: 'Active' | 'Inactive';
  category_id: number;
}

export async function listSubCategories(): Promise<SubCategoryDTO[]> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function createSubCategory(body: FormData): Promise<SubCategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/`, {
    method: 'POST',
    body,
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function getSubCategory(id: number): Promise<SubCategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/${id}`);
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function partialUpdateSubCategory(id: number, body: FormData): Promise<SubCategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
    method: 'PATCH',
    body,
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function deleteSubCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
}

export async function toggleSubCategoryStatus(id: number): Promise<SubCategoryDTO> {
  const res = await fetch(`${API_BASE_URL}/api/subcategories/${id}/toggle-status`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}
