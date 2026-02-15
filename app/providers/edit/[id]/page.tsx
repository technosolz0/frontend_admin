'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CheckCircleIcon, CubeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import {
  getServiceProvider,
  updateServiceProviderAddress,
  updateServiceProviderWork,
  updateProviderStatus,
  listCategories,
  listSubcategories
} from '@/services/providerService';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

interface FormErrors {
  name?: string;
  categoryId?: string;
  contactInfo?: string;
  [key: string]: string | undefined;
}

export default function EditServiceProviderPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = Number(params.id);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    contactInfo: '',
    status: 'inactive' as 'active' | 'inactive',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, provider] = await Promise.all([
          listCategories(),
          getServiceProvider(providerId)
        ]);

        setCategories(cats);

        // Find existing service if any
        const primaryCharge = provider.subcategory_charges && provider.subcategory_charges.length > 0
          ? provider.subcategory_charges[0]
          : null;

        setFormData({
          name: provider.full_name || '',
          categoryId: provider.category_id?.toString() || '',
          subcategoryId: primaryCharge?.subcategory_id?.toString() || '',
          serviceId: primaryCharge?.subcategory_id?.toString() || '',
          contactInfo: provider.email || provider.phone || '',
          status: provider.admin_status === 'active' ? 'active' : 'inactive',
        });
      } catch (err: unknown) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [providerId]);

  useEffect(() => {
    if (formData.categoryId) {
      listSubcategories(formData.categoryId).then(setSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact info is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Update Address/Basic Info
      const isEmail = formData.contactInfo.includes('@');
      await updateServiceProviderAddress(providerId, {
        full_name: formData.name,
        [isEmail ? 'email' : 'phone']: formData.contactInfo,
      });

      // 2. Update Work Details (Category/Subcategory)
      if (formData.categoryId && formData.serviceId) {
        await updateServiceProviderWork(providerId, {
          category_id: Number(formData.categoryId),
          subcategory_charges: [
            {
              subcategory_id: Number(formData.serviceId),
              service_charge: 0 // Default for now
            }
          ]
        });
      }

      // 3. Update Admin Status
      await updateProviderStatus(providerId, formData.status);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/providers');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service provider.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoryId' ? { subcategoryId: '', serviceId: '' } : {}),
      ...(name === 'subcategoryId' ? { serviceId: '' } : {}),
    }));
    setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
    setError(null);
  };

  if (isLoading) return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 ml-64"><Navbar /><div className="p-8 text-center text-gray-600">Loading...</div></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:text-4xl">Edit Service Provider</h2>
            <motion.div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" /> Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" /> Category
                  </label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                {/* Subcategory / Service */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" /> Service
                  </label>
                  <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting || !formData.categoryId}>
                    <option value="">Select Service</option>
                    {subcategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" /> Contact Info
                  </label>
                  <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} />
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" /> Status
                  </label>
                  <select name="status" value={formData.status} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => router.push('/providers')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg" disabled={isSubmitting}>Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
              Service provider updated successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
