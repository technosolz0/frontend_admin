'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TicketIcon, CheckCircleIcon, UserIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { createReferralCode, AdminReferralCodeCreate } from '@/services/referralCodes';

export default function AddReferralCodePage() {
    const router = useRouter();

    const [formData, setFormData] = useState<AdminReferralCodeCreate>({
        code: '',
        name: '',
        no_of_bookings: 10,
        commission_percentage: 0,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AdminReferralCodeCreate, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof AdminReferralCodeCreate, string>> = {};
        if (!formData.code.trim()) newErrors.code = 'Code is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (formData.no_of_bookings < 1) newErrors.no_of_bookings = 'Must be at least 1';
        if (formData.commission_percentage < 0 || formData.commission_percentage > 100)
            newErrors.commission_percentage = 'Must be between 0 and 100';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await createReferralCode(formData);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                router.push('/marketing/referrals');
            }, 2000);
        } catch (error) {
            console.error('Error creating referral code:', error);
            alert(error instanceof Error ? error.message : 'Failed to create referral code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4 },
        }),
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Sidebar />
            <div className="flex-1 ml-64 text-black">
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 sm:p-8"
                >
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">Add New Referral Code</h1>
                        <motion.div
                            className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleSubmit}>
                                {/* Code */}
                                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                                    <label htmlFor="code" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <TicketIcon className="w-5 h-5 mr-2 text-blue-600" />
                                        Referral Code
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4 text-black placeholder-black"
                                        disabled={isSubmitting}
                                        placeholder="e.g. WELCOME10"
                                    />
                                    {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                                </motion.div>

                                {/* Name */}
                                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                                    <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                                        Campaign Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4 text-black placeholder-black"
                                        disabled={isSubmitting}
                                        placeholder="e.g. New Vendor Welcome"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    {/* No of Bookings */}
                                    <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                                        <label htmlFor="no_of_bookings" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <CalculatorIcon className="w-5 h-5 mr-2 text-blue-600" />
                                            No. of Bookings
                                        </label>
                                        <input
                                            type="number"
                                            id="no_of_bookings"
                                            name="no_of_bookings"
                                            value={formData.no_of_bookings}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4 text-black placeholder-black"
                                            disabled={isSubmitting}
                                        />
                                        {errors.no_of_bookings && <p className="mt-2 text-sm text-red-600">{errors.no_of_bookings}</p>}
                                    </motion.div>

                                    {/* Commission % */}
                                    <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                                        <label htmlFor="commission_percentage" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <span className="w-5 h-5 mr-2 text-blue-600 flex items-center justify-center font-bold font-sm">%</span>
                                            Commission %
                                        </label>
                                        <input
                                            type="number"
                                            id="commission_percentage"
                                            name="commission_percentage"
                                            value={formData.commission_percentage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                                            disabled={isSubmitting}
                                        />
                                        {errors.commission_percentage && <p className="mt-2 text-sm text-red-600">{errors.commission_percentage}</p>}
                                    </motion.div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                                        onClick={() => router.push('/marketing/referrals')}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add Code'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
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
                            Referral code added successfully!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
