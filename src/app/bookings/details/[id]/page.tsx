'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, UserIcon, WrenchScrewdriverIcon, UserGroupIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Mock fetching booking by ID
  const bookingIndex = parseInt(bookingId) % mockBookings.length;
  const booking = mockBookings[bookingIndex] || mockBookings[0];

  if (!booking) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Booking Not Found</h1>
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
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Booking Details</h1>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
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
                <p className="text-lg text-gray-900">{booking.customerName}</p>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Category
                </h2>
                <p className="text-lg text-gray-900">{booking.categoryName}</p>
              </motion.div>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Subcategory
                </h2>
                <p className="text-lg text-gray-900">{booking.subcategoryName}</p>
              </motion.div>
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Service
                </h2>
                <p className="text-lg text-gray-900">{booking.serviceName}</p>
              </motion.div>
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Service Provider
                </h2>
                <p className="text-lg text-gray-900">{booking.serviceProviderName}</p>
              </motion.div>
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Date
                </h2>
                <p className="text-lg text-gray-900">{booking.date}</p>
              </motion.div>
              <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </h2>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    booking.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
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