import { API_BASE_URL } from '@/lib/config';
import { apiCall } from '@/lib/api';

export interface ServiceProviderDTO {
  status: string;
  id: string;
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
  subcategory_charges: { subcategory_id: string; service_charge: number }[];
  admin_status: string;
  work_status: string;
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
