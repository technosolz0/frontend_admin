'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TagIcon,  CheckCircleIcon, CubeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  categoryId: string;
  subcategoryId: string;
  serviceId: string;
  contactInfo: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Service {
  id: string;
  name: string;
  subcategoryId: string;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' },
];

const mockSubcategories: Subcategory[] = [
  { id: '1', name: 'Smartphones', categoryId: '1' },
  { id: '2', name: 'Laptops', categoryId: '1' },
  { id: '3', name: 'T-Shirts', categoryId: '2' },
  { id: '4', name: 'Jeans', categoryId: '2' },
  { id: '5', name: 'Fiction', categoryId: '3' },
];

const mockServices: Service[] = [
  { id: '1', name: 'Phone Repair', subcategoryId: '1' },
  { id: '2', name: 'Laptop Upgrade', subcategoryId: '2' },
  { id: '3', name: 'T-Shirt Customization', subcategoryId: '3' },
];

export default function AddServiceProviderPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    contactInfo: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.subcategoryId) newErrors.subcategoryId = 'Subcategory is required';
    if (!formData.serviceId) newErrors.serviceId = 'Service is required';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact info is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      setFormData({ name: '', categoryId: '', subcategoryId: '', serviceId: '', contactInfo: '', status: 'Active' });
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/providers');
      }, 2000);
      // TODO: Call API to add service provider
      // await fetch('/api/providers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add service provider.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoryId' ? { subcategoryId: '', serviceId: '' } : {}),
      ...(name === 'subcategoryId' ? { serviceId: '' } : {}),
    }));
    setErrors({ ...errors, [name]: undefined });
  };

  const filteredSubcategories = mockSubcategories.filter((sub) => sub.categoryId === formData.categoryId);
  const filteredServices = mockServices.filter((service) => service.subcategoryId === formData.subcategoryId);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">Add New Service Provider</h1>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter service provider name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </motion.div>
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="categoryId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>}
                </motion.div>
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="subcategoryId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Subcategory
                  </label>
                  <select
                    id="subcategoryId"
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting || !formData.categoryId}
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoryId && <p className="mt-2 text-sm text-red-600">{errors.subcategoryId}</p>}
                </motion.div>
                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="serviceId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Service
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting || !formData.subcategoryId}
                  >
                    <option value="">Select a service</option>
                    {filteredServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="mt-2 text-sm text-red-600">{errors.serviceId}</p>}
                </motion.div>
                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="contactInfo" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Info
                  </label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter contact info (e.g., email)"
                  />
                  {errors.contactInfo && <p className="mt-2 text-sm text-red-600">{errors.contactInfo}</p>}
                </motion.div>
                <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </motion.div>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                    onClick={() => router.push('/providers')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {isSubmitting ? 'Adding...' : 'Add Service Provider'}
                  </motion.button>
                </div>
              </form>
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
              Service provider added successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}