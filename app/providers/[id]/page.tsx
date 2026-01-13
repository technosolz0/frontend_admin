'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, EnvelopeIcon, CheckCircleIcon, WrenchScrewdriverIcon, HomeIcon, BanknotesIcon, IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

// Define interface for ServiceProvider matching VendorResponse
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
  profile_pic: string | null;
  status: string; // Maps to admin_status
  admin_status: string;
  work_status: string;
  subcategory_charges: { subcategory_id: string; service_charge: number }[];
}
interface Category {
  id: string | number;
  name: string;
}

interface Subcategory {
  id: string | number;
  name: string;
}

// Animation variants for fields
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  // State for vendor data, loading, and error
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function for auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  // Fetch vendor data and related category/subcategory names
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/${providerId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch vendor`);
        }
        const data = await response.json();

        // Fetch category name
        let categoryName = 'Unknown';
        try {
          const catResponse = await fetch(`${API_BASE_URL}/api/vendor/categories`, {
            headers: getAuthHeaders(),
          });
          if (catResponse.ok) {
            const categories = await catResponse.json();
            // const category = categories.find((cat: any) => String(cat.id) === String(data.category_id));
            const category = (categories as Category[]).find(
  (cat) => String(cat.id) === String(data.category_id)
);

            categoryName = category?.name || 'Unknown';
          }
        } catch (err) {
          console.error('Error fetching category:', err);
        }

        // Fetch subcategory name for the first subcategory_charge
        let subcategoryId = '';
        let subcategoryName = 'Unknown';
        if (data.subcategory_charges && data.subcategory_charges.length > 0) {
          subcategoryId = String(data.subcategory_charges[0].subcategory_id);
          try {
            const subResponse = await fetch(`${API_BASE_URL}/api/vendor/subcategories?category_id=${data.category_id}`, {
              headers: getAuthHeaders(),
            });
            if (subResponse.ok) {
              const subcategories = await subResponse.json();
              // const subcategory = subcategories.find((sub: any) => String(sub.id) === subcategoryId);
              const subcategory = (subcategories as Subcategory[]).find(
  (sub) => String(sub.id) === subcategoryId
);

              subcategoryName = subcategory?.name || 'Unknown';
            }
          } catch (err) {
            console.error('Error fetching subcategory:', err);
          }
        }

        // Map backend data to ServiceProvider interface
        const vendor: ServiceProvider = {
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
          serviceId: subcategoryId, // Map to subcategoryId
          serviceName: subcategoryName, // Map to subcategoryName
          profile_pic: data.profile_pic || null,
          status: data.admin_status ? data.admin_status.charAt(0).toUpperCase() + data.admin_status.slice(1) : '',
          admin_status: data.admin_status || '',
          work_status: data.work_status || '',
          subcategory_charges: data.subcategory_charges || [],
        };

        setProvider(vendor);
        setIsLoading(false);
      } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
    console.error('Error fetching vendor:', err);
  } else {
    setError('Failed to load vendor data. Please try again.');
  }
  setIsLoading(false);
}
    };

    fetchVendor();
  }, [providerId]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Render error state or not found
  if (error || !provider) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              {error || 'Service Provider Not Found'}
            </h1>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="max-w-3xl mx-auto">
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
              {/* Personal Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Name
                </h3>
                <p className="text-lg text-gray-900">{provider.name || 'N/A'}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Info
                </h3>
                <p className="text-lg text-gray-900">{provider.contactInfo || 'N/A'}</p>
              </motion.div>
              {provider.email && (
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Email
                  </h3>
                  <p className="text-lg text-gray-900">{provider.email}</p>
                </motion.div>
              )}
              {provider.phone && (
                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Phone
                  </h3>
                  <p className="text-lg text-gray-900">{provider.phone}</p>
                </motion.div>
              )}
              {provider.profile_pic && (
                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <IdentificationIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Profile Picture
                  </h3>
                  <a href={provider.profile_pic} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-600 hover:underline">
                    View Profile Picture
                  </a>
                </motion.div>
              )}

              {/* Address Details */}
              {(provider.address || provider.state || provider.city || provider.pincode) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Address Details</h2>
                  {provider.address && (
                    <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <HomeIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Address
                      </h3>
                      <p className="text-lg text-gray-900">{provider.address}</p>
                    </motion.div>
                  )}
                  {provider.city && (
                    <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                        City
                      </h3>
                      <p className="text-lg text-gray-900">{provider.city}</p>
                    </motion.div>
                  )}
                  {provider.state && (
                    <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                        State
                      </h3>
                      <p className="text-lg text-gray-900">{provider.state}</p>
                    </motion.div>
                  )}
                  {provider.pincode && (
                    <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Pincode
                      </h3>
                      <p className="text-lg text-gray-900">{provider.pincode}</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* Bank Details */}
              {(provider.account_holder_name || provider.account_number || provider.ifsc_code || provider.upi_id) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Bank Details</h2>
                  {provider.account_holder_name && (
                    <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Account Holder Name
                      </h3>
                      <p className="text-lg text-gray-900">{provider.account_holder_name}</p>
                    </motion.div>
                  )}
                  {provider.account_number && (
                    <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Account Number
                      </h3>
                      <p className="text-lg text-gray-900">{provider.account_number}</p>
                    </motion.div>
                  )}
                  {provider.ifsc_code && (
                    <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-blue-600" />
                        IFSC Code
                      </h3>
                      <p className="text-lg text-gray-900">{provider.ifsc_code}</p>
                    </motion.div>
                  )}
                  {provider.upi_id && (
                    <motion.div custom={12} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-blue-600" />
                        UPI ID
                      </h3>
                      <p className="text-lg text-gray-900">{provider.upi_id}</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* Document Details */}
              {(provider.identity_doc_type || provider.bank_doc_type || provider.address_doc_type) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Document Details</h2>
                  {provider.identity_doc_type && (
                    <motion.div custom={13} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <IdentificationIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Identity Document
                      </h3>
                      <p className="text-lg text-gray-900">
                        {provider.identity_doc_type}: {provider.identity_doc_number || 'N/A'}
                      </p>
                      {provider.identity_doc_url && (
                        <a href={provider.identity_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Document
                        </a>
                      )}
                    </motion.div>
                  )}
                  {provider.bank_doc_type && (
                    <motion.div custom={14} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Bank Document
                      </h3>
                      <p className="text-lg text-gray-900">
                        {provider.bank_doc_type}: {provider.bank_doc_number || 'N/A'}
                      </p>
                      {provider.bank_doc_url && (
                        <a href={provider.bank_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Document
                        </a>
                      )}
                    </motion.div>
                  )}
                  {provider.address_doc_type && (
                    <motion.div custom={15} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <HomeIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Address Document
                      </h3>
                      <p className="text-lg text-gray-900">
                        {provider.address_doc_type}: {provider.address_doc_number || 'N/A'}
                      </p>
                      {provider.address_doc_url && (
                        <a href={provider.address_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Document
                        </a>
                      )}
                    </motion.div>
                  )}
                </>
              )}

              {/* Work Details */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Work Details</h2>
              <motion.div custom={16} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Category
                </h3>
                <p className="text-lg text-gray-900">{provider.categoryName}</p>
              </motion.div>
              <motion.div custom={17} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Subcategory
                </h3>
                <p className="text-lg text-gray-900">{provider.subcategoryName}</p>
              </motion.div>
              <motion.div custom={18} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Service
                </h3>
                <p className="text-lg text-gray-900">{provider.serviceName}</p>
              </motion.div>
              {provider.subcategory_charges.length > 0 && (
                <motion.div custom={19} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Service Charges
                  </h3>
                  <ul className="text-lg text-gray-900">
                    {provider.subcategory_charges.map((charge, index) => (
                      <li key={index}>
                        Subcategory ID {charge.subcategory_id}: ${charge.service_charge}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              <motion.div custom={20} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Admin Status
                </h3>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {provider.status}
                </span>
              </motion.div>
              <motion.div custom={21} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Work Status
                </h3>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    provider.work_status === 'work_on' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {provider.work_status === 'work_on' ? 'Work On' : 'Work Off'}
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
