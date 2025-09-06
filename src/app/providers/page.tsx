'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { listServiceProviders, deleteServiceProvider, ServiceProviderDTO } from '@/services/providerService';

export default function ServiceProvidersPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderDTO[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const providersPerPage = 10;
  const router = useRouter();

  const fetchProviders = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { vendors, total } = await listServiceProviders(page, providersPerPage);
      setServiceProviders(vendors);
      setTotalPages(Math.ceil(total / providersPerPage));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch service providers.');
      } else {
        setError('Failed to fetch service providers.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete provider ${id}?`)) return;
    setIsDeleting(id);
    try {
      await deleteServiceProvider(id);
      setServiceProviders((prev) => prev.filter((p) => p.id !== id));
      setShowSuccess({ message: 'Service provider deleted successfully!', id });
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to delete: ${err.message}`);
      } else {
        alert('Failed to delete provider.');
      }
    } finally {
      setIsDeleting(null);
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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Service Provider Management</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/providers/add')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                Add New Service Provider
              </motion.button>
            </div>

            {isLoading && (
              <div className="flex justify-center mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Work Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceProviders.map((provider, index) => (
                    <motion.tr
                      key={provider.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/providers/${provider.id}`)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {provider.full_name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.address
                          ? `${provider.address}, ${provider.city || ''}, ${provider.state || ''} ${provider.pincode || ''}`.trim()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.admin_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {provider.admin_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.work_status === 'work_on'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {provider.work_status === 'work_on' ? 'Work On' : 'Work Off'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => router.push(`/providers/edit/${provider.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={isDeleting === provider.id}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(provider.id)}
                          className={`text-red-600 hover:text-red-800 ${
                            isDeleting === provider.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isDeleting === provider.id}
                        >
                          {isDeleting === provider.id ? (
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
                                d="M4 12a8 8 0 018-8V0C5.373 
                                0 0 5.373 0 12h4zm2 5.291A7.962 
                                7.962 0 014 12H0c0 3.042 1.135 
                                5.824 3 7.938l3-2.647z"
                              ></path>
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
            </motion.div>

            {error && <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
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
