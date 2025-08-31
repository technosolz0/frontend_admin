'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, EnvelopeIcon, CheckCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

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

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  // Mock fetching service provider by ID
  const providerIndex = parseInt(providerId) % mockServiceProviders.length;
  const provider = mockServiceProviders[providerIndex] || mockServiceProviders[0];

  if (!provider) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Service Provider Not Found</h1>
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Service Provider Details</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/providers/edit/${provider.id}`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                Edit Provider
              </motion.button>
            </div>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Name
                </h2>
                <p className="text-lg text-gray-900">{provider.name}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Category
                </h2>
                <p className="text-lg text-gray-900">{provider.categoryName}</p>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Subcategory
                </h2>
                <p className="text-lg text-gray-900">{provider.subcategoryName}</p>
              </motion.div>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Service
                </h2>
                <p className="text-lg text-gray-900">{provider.serviceName}</p>
              </motion.div>
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Info
                </h2>
                <p className="text-lg text-gray-900">{provider.contactInfo}</p>
              </motion.div>
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h2 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </h2>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {provider.status}
                </span>
              </motion.div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/providers')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                >
                  Back to Service Providers
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}