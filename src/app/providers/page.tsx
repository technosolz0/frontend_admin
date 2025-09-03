'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ServiceProvider {
  id: string;
  name: string; // Maps to full_name
  email: string | null;
  phone: string | null;
  contactInfo: string; // Derived from email or phone
  address: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  identity_doc_type: string | null;
  identity_doc_number: string | null;
  identity_doc_url: string | null;
  bank_doc_type: string | null;
  bank_doc_number: string | null;
  bank_doc_url: string | null;
  address_doc_type: string | null;
  address_doc_number: string | null;
  address_doc_url: string | null;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  serviceId: string; // Maps to subcategoryId
  serviceName: string; // Maps to subcategoryName
  status: string; // Maps to admin_status
  admin_status: string;
  work_status: string;
  subcategory_charges: { subcategory_id: string; service_charge: number }[];
}

export default function ServiceProvidersPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const providersPerPage = 10;
  const router = useRouter();

  // Helper function for auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const fetchServiceProviders = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/vendor?page=${page}&limit=${providersPerPage}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch service providers`);
      }
      const { vendors, total } = await response.json();

      // Fetch category and subcategory names
      const providers: ServiceProvider[] = await Promise.all(
        vendors.map(async (data: any) => {
          let categoryName = 'Unknown';
          let subcategoryId = '';
          let subcategoryName = 'Unknown';

          // Fetch category name
          try {
            const catResponse = await fetch(`/vendor/categories`, {
              headers: getAuthHeaders(),
            });
            if (catResponse.ok) {
              const categories = await catResponse.json();
              const category = categories.find((cat: any) => String(cat.id) === String(data.category_id));
              categoryName = category?.name || 'Unknown';
            }
          } catch (err) {
            console.error('Error fetching category:', err);
          }

          // Fetch subcategory name for the first subcategory_charge
          if (data.subcategory_charges && data.subcategory_charges.length > 0) {
            subcategoryId = String(data.subcategory_charges[0].subcategory_id);
            try {
              const subResponse = await fetch(`/vendor/subcategories?category_id=${data.category_id}`, {
                headers: getAuthHeaders(),
              });
              if (subResponse.ok) {
                const subcategories = await subResponse.json();
                const subcategory = subcategories.find((sub: any) => String(sub.id) === subcategoryId);
                subcategoryName = subcategory?.name || 'Unknown';
              }
            } catch (err) {
              console.error('Error fetching subcategory:', err);
            }
          }

          return {
            id: String(data.id),
            name: data.full_name || '',
            email: data.email || null,
            phone: data.phone || null,
            contactInfo: data.email || data.phone || '',
            address: data.address || null,
            state: data.state || null,
            city: data.city || null,
            pincode: data.pincode || null,
            account_holder_name: data.account_holder_name || null,
            account_number: data.account_number || null,
            ifsc_code: data.ifsc_code || null,
            upi_id: data.upi_id || null,
            identity_doc_type: data.identity_doc_type || null,
            identity_doc_number: data.identity_doc_number || null,
            identity_doc_url: data.identity_doc_url || null,
            bank_doc_type: data.bank_doc_type || null,
            bank_doc_number: data.bank_doc_number || null,
            bank_doc_url: data.bank_doc_url || null,
            address_doc_type: data.address_doc_type || null,
            address_doc_number: data.address_doc_number || null,
            address_doc_url: data.address_doc_url || null,
            categoryId: String(data.category_id) || '',
            categoryName,
            subcategoryId,
            subcategoryName,
            serviceId: subcategoryId,
            serviceName: subcategoryName,
            status: data.admin_status ? data.admin_status.charAt(0).toUpperCase() + data.admin_status.slice(1) : '',
            admin_status: data.admin_status || '',
            work_status: data.work_status || '',
            subcategory_charges: data.subcategory_charges || [],
          };
        })
      );

      setServiceProviders(providers);
      setTotalPages(Math.ceil(total / providersPerPage));
    } catch (error: any) {
      console.error('Error fetching service providers:', error);
      setError(error.message || 'Failed to fetch service providers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceProviders(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete service provider with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        const response = await fetch(`/vendor/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to delete service provider`);
        }
        setServiceProviders(serviceProviders.filter((provider) => provider.id !== id));
        setShowSuccess({ message: 'Service provider deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error: any) {
        console.error('Error deleting service provider:', error);
        alert(`Failed to delete service provider: ${error.message || 'Unknown error'}`);
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
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {error && (
              <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
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
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Subcategory</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Contact Info</th>
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
                          {provider.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.subcategoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.contactInfo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.address ? `${provider.address}, ${provider.city || ''}, ${provider.state || ''} ${provider.pincode || ''}`.trim() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.work_status === 'work_on' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
            </motion.div>
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