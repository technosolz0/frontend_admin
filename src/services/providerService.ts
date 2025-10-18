import { API_BASE_URL } from '@/lib/config';

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

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export async function listServiceProviders(page = 1, limit = 10): Promise<PaginatedResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vendor/?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return res.json();
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return { vendors: [], total: 0 };
  }
}

export async function getServiceProvider(id: string): Promise<ServiceProviderDTO> {
  const res = await fetch(`${API_BASE_URL}/api/vendor/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function createServiceProvider(body: FormData): Promise<ServiceProviderDTO> {
  const res = await fetch(`${API_BASE_URL}/api/vendor/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body,
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function updateServiceProvider(id: string, body: FormData): Promise<ServiceProviderDTO> {
  const res = await fetch(`${API_BASE_URL}/api/vendor/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body,
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
}

export async function deleteServiceProvider(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/vendor/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
}
