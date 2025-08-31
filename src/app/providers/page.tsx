'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ServiceProvider {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  serviceId: string;
  serviceName: string;
  contactInfo: string;
  status: string;
}

const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'TechFix Ltd',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '1',
    subcategoryName: 'Smartphones',
    serviceId: '1',
    serviceName: 'Phone Repair',
    contactInfo: 'techfix@example.com',
    status: 'Active',
  },
  {
    id: '2',
    name: 'LapCare Solutions',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '2',
    subcategoryName: 'Laptops',
    serviceId: '2',
    serviceName: 'Laptop Upgrade',
    contactInfo: 'lapcare@example.com',
    status: 'Active',
  },
  {
    id: '3',
    name: 'CustomTees Inc',
    categoryId: '2',
    categoryName: 'Clothing',
    subcategoryId: '3',
    subcategoryName: 'T-Shirts',
    serviceId: '3',
    serviceName: 'T-Shirt Customization',
    contactInfo: 'customtees@example.com',
    status: 'Inactive',
  },
];

export default function ServiceProvidersPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(mockServiceProviders);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: string } | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete service provider with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        setServiceProviders(serviceProviders.filter((provider) => provider.id !== id));
        setShowSuccess({ message: 'Service provider deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
        // TODO: Call API to delete service provider
        // await fetch(`/api/providers/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting service provider:', error);
        alert('Failed to delete service provider.');
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
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {provider.status}
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