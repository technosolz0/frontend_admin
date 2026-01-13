'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    BellIcon,
    TrashIcon,
    UserGroupIcon,
    MegaphoneIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
    NotificationDTO,
    getNotifications,
    deleteNotification,
    getNotificationStats,
    NotificationStats
} from '@/services/notificationService';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const router = useRouter();

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const skip = (currentPage - 1) * itemsPerPage;
            const [listResponse, statsResponse] = await Promise.all([
                getNotifications(skip, itemsPerPage),
                getNotificationStats()
            ]);

            setNotifications(listResponse.notifications);
            setTotalPages(Math.ceil(listResponse.total / itemsPerPage));
            setStats(statsResponse);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this notification?')) {
            try {
                await deleteNotification(id);
                fetchNotifications();
            } catch (err: unknown) {
                alert('Failed to delete notification');
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'promotional': return <MegaphoneIcon className="w-5 h-5 text-purple-500" />;
            case 'alert': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
            case 'update': return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
            default: return <BellIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTargetLabel = (type: string) => {
        switch (type) {
            case 'all_users': return 'All Users';
            case 'specific_users': return 'Specific Users';
            case 'all_vendors': return 'All Vendors';
            case 'specific_vendors': return 'Specific Vendors';
            default: return type;
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
        }),
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 sm:p-8"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Custom Notifications</h1>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/notifications/create')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center gap-2"
                            >
                                <BellIcon className="w-5 h-5" />
                                Create New
                            </motion.button>
                        </div>

                        {/* Stats Cards */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="text-gray-500 text-sm">Total Sent</div>
                                    <div className="text-2xl font-bold text-gray-800">{stats.sent_notifications}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="text-gray-500 text-sm">Delivery Rate</div>
                                    <div className="text-2xl font-bold text-green-600">{stats.delivery_rate.toFixed(1)}%</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="text-gray-500 text-sm">Pending</div>
                                    <div className="text-2xl font-bold text-yellow-600">{stats.pending_notifications}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="text-gray-500 text-sm">Total Created</div>
                                    <div className="text-2xl font-bold text-blue-600">{stats.total_notifications}</div>
                                </div>
                            </div>
                        )}

                        {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">{error}</div>}

                        <motion.div
                            className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100"
                        >
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Target</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Date Sent</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                    ) : notifications.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No notifications found.</td></tr>
                                    ) : (
                                        notifications.map((item, index) => (
                                            <motion.tr
                                                key={item.id}
                                                custom={index}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="hover:bg-blue-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="font-semibold">{item.title}</div>
                                                    <div className="truncate max-w-xs text-gray-500">{item.message}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(item.type)}
                                                        <span className="capitalize text-sm text-gray-700">{item.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <UserGroupIcon className="w-4 h-4" />
                                                        {getTargetLabel(item.target_type)}
                                                    </div>
                                                    {item.target_user_ids && item.target_user_ids.length > 0 && (
                                                        <span className="text-xs text-gray-400">({item.target_user_ids.length} specific IDs)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {item.sent_at ? new Date(item.sent_at).toLocaleString() : 'Pending'}
                                                </td>
                                                <td className="px-6 py-4 flex space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </motion.div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white rounded border disabled:opacity-50">Prev</button>
                                <span className="self-center">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white rounded border disabled:opacity-50">Next</button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
