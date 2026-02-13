import { apiCall } from '@/lib/api';

export interface ServiceProviderDTO {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  identity_doc_type: string | null;
  identity_doc_number: string | null;
  identity_doc_url: string | null;
  bank_doc_type: string | null;
  bank_doc_number: string | null;
  bank_doc_url: string | null;
  address_doc_type: string | null;
  address_doc_number: string | null;
  address_doc_url: string | null;
  category_id: string;
  admin_status: string;
  work_status: string;
  subcategory_charges: { subcategory_id: number; subcategory_name?: string; service_charge: number }[];
  bank_accounts?: unknown[];
}

interface PaginatedResponse {
  vendors: ServiceProviderDTO[];
  total: number;
}



export async function listServiceProviders(
  page = 1,
  limit = 10,
  search?: string,
  status?: string
): Promise<PaginatedResponse> {
  let url = `/api/vendor/?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (status) url += `&status=${status}`;

  const response = await apiCall<PaginatedResponse>(url, {}, { vendors: [], total: 0 });
  return response || { vendors: [], total: 0 };
}

export async function getServiceProvider(id: number): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/${id}`);
}

export async function createServiceProvider(body: FormData): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/register`, {
    method: 'POST',
    body,
  });
}

export async function updateServiceProviderAddress(vendor_id: number, data: any): Promise<ServiceProviderDTO> {
  const formData = new FormData();
  formData.append('vendor_id', vendor_id.toString());
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  return await apiCall<ServiceProviderDTO>(`/api/vendor/profile/address`, {
    method: 'PUT',
    body: formData,
  });
}

export async function updateServiceProviderWork(vendor_id: number, data: any): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/profile/work`, {
    method: 'PUT',
    body: JSON.stringify({
      vendor_id,
      ...data
    }),
  });
}

export async function deleteServiceProvider(id: number): Promise<void> {
  await apiCall(`/api/vendor/${id}`, {
    method: 'DELETE',
  });
}

export async function updateProviderStatus(id: number, status: 'active' | 'inactive'): Promise<ServiceProviderDTO> {
  const formData = new FormData();
  formData.append('vendor_id', id.toString());
  formData.append('admin_status', status);

  return await apiCall<ServiceProviderDTO>(`/api/vendor/admin/status`, {
    method: 'PUT',
    body: formData,
  });
}

export async function listCategories(): Promise<{ id: number; name: string }[]> {
  return await apiCall<{ id: number; name: string }[]>(`/api/vendor/categories`, {}, []);
}

export async function listSubcategories(categoryId?: string): Promise<{ id: number; name: string; category_id: number }[]> {
  const url = categoryId ? `/api/vendor/subcategories?category_id=${categoryId}` : `/api/vendor/subcategories`;
  return await apiCall<{ id: number; name: string; category_id: number }[]>(url, {}, []);
}
