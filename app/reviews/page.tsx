'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { StarIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
    id: string;
    providerName: string;
    customerName: string;
    serviceName: string;
    rating: number;
    comment: string;
    date: string;
    status: 'Published' | 'Hidden';
}

const mockReviews: Review[] = [
    {
        id: 'REV001',
        providerName: 'TechFix Ltd',
        customerName: 'Alice Smith',
        serviceName: 'Phone Repair',
        rating: 5,
        comment: 'Excellent service, quick repair!',
        date: '2025-05-20',
        status: 'Published',
    },
    {
        id: 'REV002',
        providerName: 'LapCare Solutions',
        customerName: 'Bob Johnson',
        serviceName: 'Laptop Upgrade',
        rating: 4,
        comment: 'Good work but slightly delayed.',
        date: '2025-05-18',
        status: 'Published',
    },
    {
        id: 'REV003',
        providerName: 'CustomTees Inc',
        customerName: 'Sarah Davis',
        serviceName: 'T-Shirt Customization',
        rating: 2,
        comment: 'Print quality could be better.',
        date: '2025-05-15',
        status: 'Hidden',
    },
    {
        id: 'REV004',
        providerName: 'StitchFix Co',
        customerName: 'Mike Lee',
        serviceName: 'Jeans Alteration',
        rating: 4.5,
        comment: 'Perfect fit, thank you!',
        date: '2025-05-10',
        status: 'Published',
    },
    {
        id: 'REV005',
        providerName: 'TechFix Ltd',
        customerName: 'Emma Wilson',
        serviceName: 'Tablet Screen Fix',
        rating: 1,
        comment: 'Screen cracked again next day.',
        date: '2025-05-05',
        status: 'Published',
    },
];

const totalReviews = mockReviews.length;
const averageRating = (
    mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
).toFixed(1);

export default function ReviewsPage() {
    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= rating ? (
                            <StarIconSolid className="w-4 h-4" />
                        ) : star - rating <= 0.5 ? (
                            // Half star visualization trick
                            <div className="relative w-4 h-4">
                                <StarIcon className="absolute w-4 h-4 text-yellow-500 hidden" />
                                <StarIconSolid className="absolute w-4 h-4 text-yellow-500 opacity-50" />
                            </div>
                        ) : (
                            <StarIcon className="w-4 h-4 text-gray-300" />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 sm:p-8"
                >
                    <div className="max-w-full mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">
                            Admin Panel - Reviews & Ratings
                        </h1>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <motion.div
                                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center">
                                    <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-blue-600 mr-4" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Total Reviews
                                        </h2>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {totalReviews}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center">
                                    <StarIconSolid className="w-10 h-10 text-yellow-500 mr-4" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Platform Avg Rating
                                        </h2>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {averageRating} / 5.0
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Reviews Table */}
                        <motion.div
                            className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 mb-6"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
                                Recent Reviews
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Review ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Provider
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Service
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Rating
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap w-1/3">
                                                Comment
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockReviews.map((review, index) => (
                                            <motion.tr
                                                key={review.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                                className="hover:bg-blue-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {review.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {review.providerName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {review.customerName}
                                                    <div className="text-xs text-gray-400 mt-1">{review.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {review.serviceName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStars(review.rating)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <p className="truncate max-w-xs" title={review.comment}>{review.comment}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status === 'Published'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {review.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
