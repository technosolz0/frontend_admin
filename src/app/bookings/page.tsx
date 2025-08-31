'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  customerName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  serviceId: string;
  serviceName: string;
  serviceProviderId: string;
  serviceProviderName: string;
  date: string;
  status: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Doe',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '1',
    subcategoryName: 'Smartphones',
    serviceId: '1',
    serviceName: 'Phone Repair',
    serviceProviderId: '1',
    serviceProviderName: 'TechFix Ltd',
    date: '2025-05-23 15:30 IST',
    status: 'Confirmed',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '2',
    subcategoryName: 'Laptops',
    serviceId: '2',
    serviceName: 'Laptop Upgrade',
    serviceProviderId: '2',
    serviceProviderName: 'LapCare Solutions',
    date: '2025-05-24 10:00 IST',
    status: 'Pending',
  },
  {
    id: '3',
    customerName: 'Alice Brown',
    categoryId: '2',
    categoryName: 'Clothing',
    subcategoryId: '3',
    subcategoryName: 'T-Shirts',
    serviceId: '3',
    serviceName: 'T-Shirt Customization',
    serviceProviderId: '3',
    serviceProviderName: 'CustomTees Inc',
    date: '2025-05-25 14:00 IST',
    status: 'Cancelled',
  },
];

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: string } | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete booking with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        setBookings(bookings.filter((booking) => booking.id !== id));
        setShowSuccess({ message: 'Booking deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
        // TODO: Call API to delete booking
        // await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking.');
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
          <div className="max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Booking Management</h1>
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
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.customerName}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{booking.categoryName}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{booking.subcategoryName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.serviceName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.serviceProviderName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          {/* <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push(`/bookings/details/${booking.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={isDeleting === booking.id}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </motion.button> */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(booking.id)}
                            className={`text-red-600 hover:text-red-800 ${
                              isDeleting === booking.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isDeleting === booking.id}
                          >
                            {isDeleting === booking.id ? (
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