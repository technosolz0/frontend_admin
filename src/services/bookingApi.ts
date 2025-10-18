import { API_BASE_URL } from '@/lib/config';
import { getToken, clearToken } from '@/lib/auth';
import { ReactNode } from 'react';

// ---------- Interfaces ----------
export interface BookingDTO {
  date: string | number | Date;
  categoryName: any;
  subcategoryName: any;
  serviceName: any;
  customerName: ReactNode;
  id: number;
  user_id: number;
  category_id: number;
  subcategory_id: number;
  serviceprovider_id: number;
  scheduled_time: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  otp?: string;
  category_name?: string;
  subcategory_name?: string;
}

export interface BookingCreateDTO {
  user_id: number;
  category_id: number;
  subcategory_id: number;
  serviceprovider_id: number;
  scheduled_time: string;
}

export interface BookingStatusUpdateDTO {
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  otp?: string;
}

export interface VendorStatsDTO {
  pending: ReactNode;
  cancelled: ReactNode;
  completed: ReactNode;
  total_bookings: number;
  status_counts: Record<string, number>;
  recent_bookings: BookingDTO[];
}

// ---------- Helper ----------
async function fetchWithAuth<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} - ${text}`);
  }

  return res.json() as Promise<T>;
}

// ---------- API Functions ----------

// User
export async function createBooking(body: BookingCreateDTO, token: string) {
  return fetchWithAuth<BookingDTO>('/api/bookings/', { method: 'POST', body: JSON.stringify(body) }, token);
}

export async function getUserBookings(token: string, status?: string, skip = 0, limit = 10) {
  try {
    const url = new URL(`${API_BASE_URL}/api/bookings/`);
    if (status) url.searchParams.append('status', status);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', limit.toString());
    return await fetchWithAuth<BookingDTO[]>(url.pathname + url.search, undefined, token);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function getBooking(id: number, token: string) {
  return fetchWithAuth<BookingDTO>(`/api/bookings/${id}`, undefined, token);
}

export async function updateBookingStatus(id: number, body: BookingStatusUpdateDTO, token: string) {
  return fetchWithAuth<BookingDTO>(`/api/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }, token);
}

export async function cancelBooking(id: number, token: string) {
  return fetchWithAuth<void>(`/api/bookings/${id}`, { method: 'DELETE' }, token);
}

export async function sendCompletionOTP(id: number, token: string) {
  return fetchWithAuth<void>(`/api/bookings/${id}/send-completion-otp`, { method: 'POST' }, token);
}

// Vendor
export async function getVendorBookings(token: string, status?: string, skip = 0, limit = 10) {
  const url = new URL(`${API_BASE_URL}/api/bookings/vendor/my-bookings`);
  if (status) url.searchParams.append('status', status);
  url.searchParams.append('skip', skip.toString());
  url.searchParams.append('limit', limit.toString());
  return fetchWithAuth<BookingDTO[]>(url.pathname + url.search, undefined, token);
}

export async function getVendorStats(token: string) {
  return fetchWithAuth<VendorStatsDTO>('/api/bookings/vendor/stats', undefined, token);
}
