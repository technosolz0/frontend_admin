// Updated '@/services/accountRequests.ts'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

export interface AccountDeleteRequestDTO {
  id: number;
  name: string;
  phone: string;
  reason: string;
  requestDate: string;
  role: string;
  image?: string;
}

export interface PagedAccountDeleteRequests {
  data: AccountDeleteRequestDTO[];
  total: number;
}

export interface DeleteRequestCreateDTO {
  user_id?: number;
  vendor_id?: number;
  reason: string;
  role: 'user' | 'vendor';
}

// export const listAccountDeleteRequests = async (page: number = 1, limit: number = 10): Promise<PagedAccountDeleteRequests> => {
//   const skip = (page - 1) * limit;
//   const response = await axios.get(`${API_BASE_URL}/delete-request/list?skip=${skip}&limit=${limit}`);
//   return response.data;
// };
export const listAccountDeleteRequests = async (
  page = 1,
  limit = 10,
  filters?: { name?: string; role?: string; phone?: string }
) => {
  const skip = (page - 1) * limit;
  const query = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (filters?.name) query.append('name', filters.name);
  if (filters?.role) query.append('role', filters.role);
  if (filters?.phone) query.append('phone', filters.phone);

  const res = await axios.get(`${API_BASE_URL}/api/delete-request/list?${query.toString()}`);
  return res.data;
};


export const createAccountDeleteRequest = async (req: DeleteRequestCreateDTO): Promise<AccountDeleteRequestDTO> => {
  const response = await axios.post(`${API_BASE_URL}/api/delete-request/submit`, req);
  return response.data;
};

export const deleteAccountRequest = async (id: number): Promise<{ result: number; message: string }> => {
  const response = await axios.delete(`${API_BASE_URL}/api/delete-request/${id}`);
  return response.data;
};