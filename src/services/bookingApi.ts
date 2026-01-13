import { API_BASE_URL } from '@/lib/config';
import { apiCall } from '@/lib/api';



export interface BookingDTO {
  id: number;
  user_id: number;
  serviceprovider_id: number;
  category_id: number;
  subcategory_id: number;
  scheduled_time: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  otp?: string;
  category_name?: string;
  subcategory_name?: string;
  service_name?: string;
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
  pending: number;
  cancelled: number;
  completed: number;
  total_bookings: number;
  status_counts: Record<string, number>;
  recent_bookings: BookingDTO[];
}

export interface BookingListResponse {
  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  filters_applied: {
    status?: string;
    user_id?: number;
    vendor_id?: number;
    search?: string;
  };
}

// ---------- Helper ----------
// Removed custom fetchWithAuth - now using centralized apiCall

// ---------- API Functions ----------

// User
export async function createBooking(body: BookingCreateDTO) {
  return await apiCall<BookingDTO>(`/api/bookings/`, { method: 'POST', body: JSON.stringify(body) });
}

export async function getUserBookings(status?: string, skip = 0, limit = 10) {
  try {
    let url = `/api/bookings/?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return await apiCall<BookingDTO[]>(url);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function getBooking(id: number) {
  return await apiCall<BookingDTO>(`/api/bookings/${id}`);
}

export async function updateBookingStatus(id: number, body: BookingStatusUpdateDTO) {
  return await apiCall<BookingDTO>(`/api/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function cancelBooking(id: number) {
  return await apiCall<void>(`/api/bookings/${id}`, { method: 'DELETE' });
}

export async function sendCompletionOTP(id: number) {
  return await apiCall<void>(`/api/bookings/${id}/send-completion-otp`, { method: 'POST' });
}

// Vendor
export async function getVendorBookings(status?: string, skip = 0, limit = 10) {
  let url = `/api/bookings/vendor/my-bookings?skip=${skip}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  return await apiCall<BookingDTO[]>(url);
}

export async function getVendorStats() {
  return await apiCall<VendorStatsDTO>(`/api/bookings/vendor/stats`);
}

// Admin
export async function getAllBookings(
  status?: string,
  user_id?: number,
  vendor_id?: number,
  search?: string,
  page: number = 1,
  limit: number = 10
): Promise<BookingListResponse> {
  let url = `/api/bookings/admin/all?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (user_id) url += `&user_id=${user_id}`;
  if (vendor_id) url += `&vendor_id=${vendor_id}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  return await apiCall<BookingListResponse>(url, {}, {
    bookings: [],
    total: 0,
    page: 1,
    limit,
    total_pages: 0,
    filters_applied: {}
  });
}
