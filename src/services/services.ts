import { apiCall, getToken, API_BASE_URL } from '@/lib/api';

export interface ServiceDTO {
  id: number;
  name: string;
  description: string | null;
  price: number;
  status: 'Active' | 'Inactive';
  category: CategoryDTO;
  sub_category: SubcategoryDTO;
  image: string | null;
}


export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
}

export interface SubcategoryDTO {
  id: number;
  name: string;
  category_id: number;
  description?: string;
}

export interface CreateServiceDTO {
  name: string;
  description: string;
  price?: number;
  status: 'Active' | 'Inactive';
  category_id: number | string;
  sub_category_id: number | string;
  image?: File | null;
}

// Services API
export async function listServices(): Promise<ServiceDTO[]> {
  return await apiCall<ServiceDTO[]>('/api/services/');
}

export async function createService(data: CreateServiceDTO): Promise<ServiceDTO> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('status', data.status);
  formData.append('category_id', String(data.category_id));
  formData.append('sub_category_id', String(data.sub_category_id));

  if (data.price !== undefined) {
    formData.append('price', String(data.price));
  }

  if (data.image) {
    formData.append('image', data.image);
  }

  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/services/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  return response.json();
}

export async function getService(id: number): Promise<ServiceDTO> {
  return await apiCall<ServiceDTO>(`/api/services/${id}`);
}

// Alias for consistency with component usage
export const getServiceById = getService;
export async function updateService(id: number, data: Partial<ServiceDTO> & { image?: File | null }): Promise<ServiceDTO> {
  const formData = new FormData();

  if (data.name !== undefined) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description || '');
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.status !== undefined) formData.append('status', data.status);
  if (data.category && data.category.id !== undefined)
    formData.append('category_id', String(data.category.id));
  if (data.sub_category && data.sub_category.id !== undefined)
    formData.append('sub_category_id', String(data.sub_category.id));
  if (data.image) formData.append('image', data.image);

  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  console.log('Update service response:', response);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  return response.json();
}

export async function partialUpdateService(id: number, body: FormData): Promise<ServiceDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
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

export async function deleteService(id: number): Promise<void> {
  await apiCall(`/api/services/${id}`, { method: 'DELETE' });
}

export async function toggleServiceStatus(id: number): Promise<ServiceDTO> {
  return await apiCall<ServiceDTO>(`/api/services/${id}/toggle-status`, { method: 'POST' });
}

// Categories API
export async function listCategories(): Promise<CategoryDTO[]> {
  return await apiCall<CategoryDTO[]>('/api/categories/');
}

export async function createCategory(data: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> {
  return await apiCall<CategoryDTO>('/api/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: Partial<CategoryDTO>): Promise<CategoryDTO> {
  return await apiCall<CategoryDTO>(`/api/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await apiCall(`/api/categories/${id}`, { method: 'DELETE' });
}

// Subcategories API
export async function listSubcategories(): Promise<SubcategoryDTO[]> {
  return await apiCall<SubcategoryDTO[]>('/api/subcategories/');
}

export async function createSubcategory(data: Omit<SubcategoryDTO, 'id'>): Promise<SubcategoryDTO> {
  return await apiCall<SubcategoryDTO>('/api/subcategories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubcategory(id: number, data: Partial<SubcategoryDTO>): Promise<SubcategoryDTO> {
  return await apiCall<SubcategoryDTO>(`/api/subcategories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteSubcategory(id: number): Promise<void> {
  await apiCall(`/api/subcategories/${id}`, { method: 'DELETE' });
}
