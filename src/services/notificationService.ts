import { apiCall } from '@/lib/api';

export enum NotificationType {
    GENERAL = "general",
    PROMOTIONAL = "promotional",
    ALERT = "alert",
    UPDATE = "update"
}

export enum NotificationTarget {
    ALL_USERS = "all_users",
    SPECIFIC_USERS = "specific_users",
    ALL_VENDORS = "all_vendors",
    SPECIFIC_VENDORS = "specific_vendors"
}

export interface NotificationDTO {
    id: number;
    title: string;
    message: string;
    type: string;
    target_type: string;
    target_user_ids: number[] | null;
    is_sent: boolean;
    sent_at: string | null;
    created_at: string;
    sent_by: number;
}

export interface NotificationStats {
    total_notifications: number;
    sent_notifications: number;
    pending_notifications: number;
    delivery_rate: number;
}

interface NotificationListResponse {
    notifications: NotificationDTO[];
    total: number;
}

interface SendNotificationResponse {
    message: string;
    notification_id: number;
    target_count: number;
}

export async function getNotifications(
    skip: number = 0,
    limit: number = 10
): Promise<NotificationListResponse> {
    const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
    });
    return await apiCall<NotificationListResponse>(`/api/notifications/?${params.toString()}`);
}

export async function getNotificationDetail(id: number): Promise<NotificationDTO> {
    return await apiCall<NotificationDTO>(`/api/notifications/${id}`);
}

export async function sendNotification(
    title: string,
    message: string,
    notification_type: NotificationType,
    target_type: NotificationTarget,
    target_user_ids: number[] | null = null
): Promise<SendNotificationResponse> {
    const params = new URLSearchParams({
        title,
        message,
        notification_type,
        target_type,
    });

    // Note: Backend expects target_user_ids as body if present? 
    // Checking routes: 
    // target_user_ids: Optional[List[int]] = None is a query param by default in FastAPI if not annotated with Query, Body, etc.
    // BUT lists in query params are tricky (e.g. ?target_user_ids=1&target_user_ids=2). 
    // Let's assume standard query param serialization for list.
    // HOWEVER, this is a POST request, and typically complex data goes in body.
    // Looking at notification_routes.py:
    // @router.post("/send")
    // async def send_custom_notification(..., target_user_ids: Optional[List[int]] = None, ...)
    // It's likely query params (FastAPI default).

    // To match FastAPI list query param: append multiple times
    if (target_user_ids && target_user_ids.length > 0) {
        target_user_ids.forEach(id => params.append('target_user_ids', id.toString()));
    }

    return await apiCall<SendNotificationResponse>(`/api/notifications/send?${params.toString()}`, {
        method: 'POST',
    });
}

export async function deleteNotification(id: number): Promise<void> {
    await apiCall(`/api/notifications/${id}`, {
        method: 'DELETE',
    });
}

export async function getNotificationStats(): Promise<NotificationStats> {
    return await apiCall<NotificationStats>('/api/notifications/stats/overview');
}
