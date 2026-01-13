'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { listServiceProviders, deleteServiceProvider, toggleProviderStatus, ServiceProviderDTO } from '@/services/providerService';

export default function ServiceProvidersPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderDTO[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState<{ provider: ServiceProviderDTO; newStatus: string } | null>(null);
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

  const handleDelete = async (id: number) => {
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

  const handleToggleStatusClick = (provider: ServiceProviderDTO) => {
    setShowStatusDialog({
      provider,
      newStatus: provider.admin_status === 'approved' ? 'pending' : 'approved'
    });
  };

  const handleToggleStatusConfirm = async () => {
    if (!showStatusDialog) return;

    const { provider, newStatus } = showStatusDialog;
    setIsToggling(provider.id);
    setShowStatusDialog(null);

    try {
      const updatedProvider = await toggleProviderStatus(provider.id);
      setServiceProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? updatedProvider : p))
      );
      setShowSuccess({
        message: `Provider status changed to ${updatedProvider.admin_status}!`,
        id: provider.id
      });
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to update status: ${err.message}`);
      } else {
        alert('Failed to update provider status.');
      }
    } finally {
      setIsToggling(null);
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleStatusClick(provider)}
                          disabled={isToggling === provider.id}
                          className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-all duration-200 ${provider.admin_status === 'approved'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            } ${isToggling === provider.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isToggling === provider.id ? (
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            provider.admin_status === 'approved' ? (
                              <CheckCircleIcon className="w-3 h-3" />
                            ) : (
                              <XMarkIcon className="w-3 h-3" />
                            )
                          )}
                          {provider.admin_status.charAt(0).toUpperCase() + provider.admin_status.slice(1)}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.work_status === 'work_on'
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
                          className={`text-red-600 hover:text-red-800 ${isDeleting === provider.id ? 'opacity-50 cursor-not-allowed' : ''
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

        {/* Status Change Confirmation Dialog */}
        <AnimatePresence>
          {showStatusDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowStatusDialog(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Change Provider Status
                    </h3>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to change the status of{' '}
                    <span className="font-medium text-gray-900">
                      {showStatusDialog.provider.full_name}
                    </span>{' '}
                    from{' '}
                    <span className="font-medium text-gray-900">
                      {showStatusDialog.provider.admin_status}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium text-gray-900">
                      {showStatusDialog.newStatus}
                    </span>
                    ?
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowStatusDialog(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleStatusConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
