'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, UserIcon, UserGroupIcon, CalendarIcon, CheckCircleIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { apiCall } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Booking {
  id: number;
  user_id: number;
  serviceprovider_id: number;
  category_id: number;
  subcategory_id: number;
  scheduled_time?: string;
  address: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
  created_at: string;
  otp?: string;
  otp_created_at?: string;
  // Related data
  user_name?: string;
  user_email?: string;
  user_mobile?: string;
  service_provider_name?: string;
  category_name?: string;
  subcategory_name?: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await apiCall<Booking>(`/api/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <LoadingSpinner message="Loading booking details..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 sm:text-4xl mb-6">Booking Not Found</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error || 'Booking not found or access denied.'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/bookings')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                >
                  Back to Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-4xl mb-6">Booking Details</h2>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100 mt-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Booking ID
                </h2>
                <p className="text-lg text-gray-900">{booking.id}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Name
                </h2>
                <button
                  onClick={() => router.push(`/users/${booking.user_id}`)}
                  className="text-lg text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  {booking.user_name || 'N/A'}
                </button>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Email
                </h2>
                <p className="text-lg text-gray-900">{booking.user_email || 'N/A'}</p>
              </motion.div>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Customer Mobile
                </h2>
                <p className="text-lg text-gray-900">{booking.user_mobile || 'N/A'}</p>
              </motion.div>
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Category
                </h2>
                <p className="text-lg text-gray-900">{booking.category_name || 'N/A'}</p>
              </motion.div>
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Subcategory
                </h2>
                <p className="text-lg text-gray-900">{booking.subcategory_name || 'N/A'}</p>
              </motion.div>
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Service Provider
                </h2>
                <button
                  onClick={() => router.push(`/providers/${booking.serviceprovider_id}`)}
                  className="text-lg text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                >
                  {booking.service_provider_name || 'N/A'}
                </button>
              </motion.div>
              <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Address
                </h2>
                <p className="text-lg text-gray-900">{booking.address}</p>
              </motion.div>
              <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Scheduled Time
                </h2>
                <p className="text-lg text-gray-900">{booking.scheduled_time ? new Date(booking.scheduled_time).toLocaleString() : 'Not scheduled'}</p>
              </motion.div>
              <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Created At
                </h2>
                <p className="text-lg text-gray-900">{new Date(booking.created_at).toLocaleString()}</p>
              </motion.div>
              {booking.otp && (
                <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                    OTP
                  </h2>
                  <p className="text-lg text-gray-900">{booking.otp}</p>
                </motion.div>
              )}
              {booking.otp_created_at && (
                <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                    OTP Created At
                  </h2>
                  <p className="text-lg text-gray-900">{new Date(booking.otp_created_at).toLocaleString()}</p>
                </motion.div>
              )}
              <motion.div custom={12} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </h2>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${booking.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.status === 'accepted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </motion.div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/bookings')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                >
                  Back to Bookings
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
