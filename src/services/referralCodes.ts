import { apiCall, getToken, API_BASE_URL } from '@/lib/api';

export interface AdminReferralCodeDTO {
    id: number;
    code: string;
    name: string;
    no_of_bookings: number;
    commission_percentage: number;
    created_at: string;
    updated_at: string;
}

export interface AdminReferralCodeCreate {
    code: string;
    name: string;
    no_of_bookings: number;
    commission_percentage: number;
}

export async function listReferralCodes(): Promise<AdminReferralCodeDTO[]> {
    const data = await apiCall<AdminReferralCodeDTO[]>('/api/admin/referrals/', {}, []);
    return data || [];
}

export async function createReferralCode(body: AdminReferralCodeCreate): Promise<AdminReferralCodeDTO> {
    return await apiCall<AdminReferralCodeDTO>('/api/admin/referrals/', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function getReferralCode(id: number): Promise<AdminReferralCodeDTO> {
    return await apiCall<AdminReferralCodeDTO>(`/api/admin/referrals/${id}`);
}

export async function updateReferralCode(id: number, body: Partial<AdminReferralCodeCreate>): Promise<AdminReferralCodeDTO> {
    return await apiCall<AdminReferralCodeDTO>(`/api/admin/referrals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function deleteReferralCode(id: number): Promise<void> {
    await apiCall(`/api/admin/referrals/${id}`, { method: 'DELETE' });
}
