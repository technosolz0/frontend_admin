'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { apiCall } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchFilter from '@/components/SearchFilter';

interface Booking {
  id: number;
  user_id: number;
  serviceprovider_id: number;
  category_id: number;
  subcategory_id: number;
  status: string;
  scheduled_time: string | null;
  address: string;
  otp: string | null;
  created_at: string | null;
  user_name: string;
  category_name: string | null;
  subcategory_name: string | null;
  service_name: string | null;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const bookingsPerPage = 10;
  const router = useRouter();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBookings = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * bookingsPerPage;
      let url = `${API_BASE_URL}/api/bookings/admin/all?skip=${skip}&limit=${bookingsPerPage}`;

      // Add filters to URL
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (userFilter) url += `&user_id=${userFilter}`;
      if (vendorFilter) url += `&vendor_id=${vendorFilter}`;

      const data = await apiCall<{
        bookings: Booking[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        filters_applied?: Record<string, unknown>;
      }>(url, {}, {
        bookings: [],
        total: 0,
        page: 1,
        limit: bookingsPerPage,
        total_pages: 1
      });

      console.log('Bookings data:', data);
      if (data && typeof data === 'object' && 'bookings' in data) {
        setBookings(data.bookings || []);
        setTotalPages(data.total_pages || 1);
      } else {
        console.error('Invalid API response format:', data);
        setBookings([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Error handling is now done in apiCall - redirects to login on 401
    } finally {
      setIsLoading(false);
    }
  }, [bookingsPerPage, searchQuery, statusFilter, userFilter, vendorFilter]);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  // Trigger search when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchBookings(1);
  }, [searchQuery, statusFilter, userFilter, vendorFilter, fetchBookings]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setUserFilter('');
    setVendorFilter('');
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete booking with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        await apiCall(`${API_BASE_URL}/api/bookings/${id}`, {
          method: 'DELETE',
        });
        setBookings(bookings.filter((booking) => booking.id.toString() !== id));
        setShowSuccess({ message: 'Booking deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
          <div className="max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Booking Management</h1>

            <SearchFilter
              searchPlaceholder="Search by customer name, email, address, or booking ID..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  value: statusFilter,
                  options: [
                    { value: 'pending', label: 'Pending' },
                    { value: 'accepted', label: 'Accepted' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ],
                  onChange: setStatusFilter
                },
                {
                  key: 'user',
                  label: 'Customer ID',
                  value: userFilter,
                  options: [], // Empty for input field
                  onChange: setUserFilter
                },
                {
                  key: 'vendor',
                  label: 'Provider ID',
                  value: vendorFilter,
                  options: [], // Empty for input field
                  onChange: setVendorFilter
                }
              ]}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              hasActiveFilters={!!(searchQuery || statusFilter || userFilter || vendorFilter)}
              onClearFilters={clearFilters}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: handlePageChange,
                isLoading
              }}
            />

            {isLoading && (
              <LoadingSpinner message="Loading bookings..." />
            )}
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Booking ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                      <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Category</th>
                      <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Subcategory</th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Service</th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Service Provider</th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/bookings/details/${booking.id}`)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {booking.id}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user_name}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{booking.category_name || 'N/A'}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{booking.subcategory_name || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.service_name || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Provider #{booking.serviceprovider_id}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.scheduled_time ? new Date(booking.scheduled_time).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'completed'
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
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(booking.id.toString())}
                            className={`text-red-600 hover:text-red-800 ${
                              isDeleting === booking.id.toString() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isDeleting === booking.id.toString()}
                          >
                            {isDeleting === booking.id.toString() ? (
                              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <TrashIcon className="w-5 h-5" />
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              {showSuccess.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
