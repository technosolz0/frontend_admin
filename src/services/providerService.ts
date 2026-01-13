import { API_BASE_URL } from '@/lib/config';
import { apiCall } from '@/lib/api';

export interface ServiceProviderDTO {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  identity_doc_type?: string;
  identity_doc_number?: string;
  identity_doc_url?: string;
  bank_doc_type?: string;
  bank_doc_number?: string;
  bank_doc_url?: string;
  address_doc_type?: string;
  address_doc_number?: string;
  address_doc_url?: string;
  category_id?: number;
  category_name?: string;
  profile_pic?: string;
  step?: number;
  status: string;
  admin_status: string;
  work_status: string;
  subcategory_charges: { subcategory_id: number; subcategory_name?: string; service_charge: number }[];
  bank_accounts?: any[];
}

interface PaginatedResponse {
  vendors: ServiceProviderDTO[];
  total: number;
}



export async function listServiceProviders(page = 1, limit = 10): Promise<PaginatedResponse> {
  const response = await apiCall<PaginatedResponse>(`/api/vendor/?page=${page}&limit=${limit}`, {}, { vendors: [], total: 0 });
  return response || { vendors: [], total: 0 };
}

export async function getServiceProvider(id: string): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/${id}`);
}

export async function createServiceProvider(body: FormData): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/`, {
    method: 'POST',
    body,
  });
}

export async function updateServiceProvider(id: string, body: FormData): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/${id}`, {
    method: 'PATCH',
    body,
  });
}

export async function deleteServiceProvider(id: string): Promise<void> {
  await apiCall(`/api/vendor/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleProviderStatus(id: string): Promise<ServiceProviderDTO> {
  return await apiCall<ServiceProviderDTO>(`/api/vendor/${id}/toggle-status`, {
    method: 'PATCH',
  });
}
