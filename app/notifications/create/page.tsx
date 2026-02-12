'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import {
    sendNotification,
    NotificationType,
    NotificationTarget
} from '@/services/notificationService';

export default function CreateNotificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: NotificationType.GENERAL,
        targetType: NotificationTarget.ALL_USERS,
        targetIds: '' // Comma separated IDs for specific targeting
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            alert('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            let ids: number[] | null = null;
            if (
                formData.targetType === NotificationTarget.SPECIFIC_USERS
            ) {
                if (!formData.targetIds.trim()) {
                    alert('Please enter Target IDs');
                    setLoading(false);
                    return;
                }
                ids = formData.targetIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            }

            await sendNotification(
                formData.title,
                formData.message,
                formData.type,
                formData.targetType,
                ids
            );

            alert('Notification sent successfully!');
            router.push('/notifications');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            alert(`Failed to send: ${message}`);
        } finally {
            setLoading(false);
        }
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
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 mb-6 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Notifications
                        </button>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                                <h1 className="text-2xl font-bold text-white flex items-center">
                                    <PaperAirplaneIcon className="w-6 h-6 mr-2" />
                                    Send New Notification
                                </h1>
                                <p className="text-blue-100 mt-2">Compose and broadcast messages to your users.</p>
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. Special Offer!"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Type your message here..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value as NotificationType })}
                                            >
                                                <option value={NotificationType.GENERAL}>General</option>
                                                <option value={NotificationType.PROMOTIONAL}>Promotional</option>
                                                <option value={NotificationType.BOOKING_UPDATE}>Booking Update</option>
                                                <option value={NotificationType.SYSTEM}>System</option>
                                            </select>
                                        </div>

                                        {/* Target */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                                value={formData.targetType}
                                                onChange={e => setFormData({ ...formData, targetType: e.target.value as NotificationTarget })}
                                            >
                                                <option value={NotificationTarget.ALL_USERS}>All Regular Users</option>
                                                <option value={NotificationTarget.SERVICE_PROVIDERS}>All Service Providers</option>
                                                <option value={NotificationTarget.SPECIFIC_USERS}>Specific Users (by ID)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Specific IDs Input */}
                                    {formData.targetType === NotificationTarget.SPECIFIC_USERS && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                                        >
                                            <label className="block text-sm font-medium text-yellow-800 mb-1">
                                                Target IDs (Comma Separated)
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-yellow-300 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none text-black"
                                                placeholder="e.g. 1, 5, 12"
                                                value={formData.targetIds}
                                                onChange={e => setFormData({ ...formData, targetIds: e.target.value })}
                                            />
                                            <p className="text-yellow-600 text-xs mt-1">Enter valid numeric IDs separated by commas.</p>
                                        </motion.div>
                                    )}

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="px-6 py-2 mr-4 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {loading ? 'Sending...' : (
                                                <>
                                                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                                                    Send Notification
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
