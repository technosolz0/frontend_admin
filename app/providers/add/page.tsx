'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { listCategories, createServiceProvider } from '@/services/providerService';

interface Category {
  id: number;
  name: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  categoryId?: string;
  [key: string]: string | undefined;
}


export default function AddServiceProviderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    status: 'inactive',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    listCategories().then(setCategories).catch((err: unknown) => console.error('Failed to load categories', err));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('full_name', formData.name);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('password', formData.password);
      fd.append('terms_accepted', 'true');
      fd.append('identity_doc_type', 'Aadhar'); // Default for now
      fd.append('identity_doc_number', '123456789012'); // Placeholder

      await createServiceProvider(fd);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/providers');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add service provider.';
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:text-4xl">Add New Service Provider</h2>
            <motion.div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" /> Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} placeholder="Full Name" />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" /> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} placeholder="Email Address" />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" /> Phone
                  </label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} placeholder="Phone Number" />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" /> Password
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="text-black block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4" disabled={isSubmitting} placeholder="Set Password" />
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
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

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => router.push('/providers')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Provider'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
              Provider added successfully! OTP sent to email.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}