import { apiCall } from '@/lib/api';

export interface FeedbackDTO {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    subject: string;
    message: string;
    category: string | null;
    is_resolved: boolean;
    admin_response: string | null;
    responded_at: string | null;
    responded_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface FeedbackStats {
    total: number;
    resolved: number;
    unresolved: number;
}

interface FeedbackListResponse {
    feedback: FeedbackDTO[];
    total: number;
}

export async function getFeedbackList(
    skip: number = 0,
    limit: number = 10,
    resolved?: boolean
): Promise<FeedbackListResponse> {
    const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
    });
    if (resolved !== undefined) {
        params.append('resolved', resolved.toString());
    }

    return await apiCall<FeedbackListResponse>(`/api/feedback/admin/all?${params.toString()}`);
}

export async function getFeedbackDetail(id: number): Promise<FeedbackDTO> {
    return await apiCall<FeedbackDTO>(`/api/feedback/admin/${id}`);
}

export async function respondToFeedback(id: number, response: string): Promise<void> {
    // Backend expects response as a query parameter
    const params = new URLSearchParams({ response });
    await apiCall(`/api/feedback/admin/${id}/respond?${params.toString()}`, {
        method: 'POST',
    });
}

export async function updateFeedbackStatus(id: number, resolved: boolean): Promise<void> {
    const params = new URLSearchParams({ resolved: resolved.toString() });
    await apiCall(`/api/feedback/admin/${id}/status?${params.toString()}`, {
        method: 'PUT',
    });
}

export async function deleteFeedback(id: number): Promise<void> {
    await apiCall(`/api/feedback/admin/${id}`, {
        method: 'DELETE',
    });
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
    return await apiCall<FeedbackStats>('/api/feedback/admin/stats');
}
