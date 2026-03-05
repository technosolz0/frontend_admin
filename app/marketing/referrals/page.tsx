'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
    AdminReferralCodeDTO,
    listReferralCodes,
    deleteReferralCode,
} from '@/services/referralCodes';

export default function ReferralCodesPage() {
    const [referralCodes, setReferralCodes] = useState<AdminReferralCodeDTO[]>([]);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchReferralCodes = async () => {
            try {
                const data = await listReferralCodes();
                setReferralCodes(data);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error('Error fetching referral codes:', message);
                setError(message || 'Failed to fetch referral codes.');
            }
        };
        fetchReferralCodes();
    }, []);

    // Pagination Logic
    const totalPages = Math.ceil(referralCodes.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReferralCodes = referralCodes.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm(`Are you sure you want to delete referral code with ID ${id}?`)) {
            setIsDeleting(id);
            try {
                await deleteReferralCode(id);
                setReferralCodes(referralCodes.filter((rc) => rc.id !== id));
                setShowSuccess({ message: 'Referral code deleted successfully!', id });
                setTimeout(() => setShowSuccess(null), 2000);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error('Error deleting referral code:', message);
                setError(message || 'Failed to delete referral code.');
            } finally {
                setIsDeleting(null);
            }
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
                    transition={{ duration: 0.5 }}
                    className="p-6 sm:p-8"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6 text-black">
                            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Referral Code Management</h1>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/marketing/referrals/add')}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add New Code
                            </motion.button>
                        </div>
                        {error && (
                            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        <motion.div
                            className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <table className="min-w-full divide-y divide-gray-200 text-black">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Bookings Limit</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Commission %</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentReferralCodes.length > 0 ? (
                                        currentReferralCodes.map((rc, index) => (
                                            <motion.tr
                                                key={rc.id}
                                                custom={index}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="hover:bg-blue-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-blue-600">{rc.code}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{rc.name}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{rc.no_of_bookings} bookings</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{rc.commission_percentage}%</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => router.push(`/marketing/referrals/edit/${rc.id}`)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        disabled={isDeleting === rc.id}
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(rc.id)}
                                                        className={`text-red-600 hover:text-red-800 ${isDeleting === rc.id ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        disabled={isDeleting === rc.id}
                                                    >
                                                        {isDeleting === rc.id ? (
                                                            <svg
                                                                className="animate-spin h-5 w-5 text-red-600"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <TrashIcon className="w-5 h-5" />
                                                        )}
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No referral codes found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </motion.div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                                    <span className="ml-2 text-gray-500">({referralCodes.length} total)</span>
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                    </div>
                </motion.div>
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            {showSuccess.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
