'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getCategory, partialUpdateCategory } from '@/services/categories';
import { API_BASE_URL } from '@/lib/config';

type FormData = {
  name: string;
  status: 'Active' | 'Inactive';
};

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params.id);

  const [formData, setFormData] = useState<FormData>({ name: '', status: 'Active' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; server?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch category details on load
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategory(categoryId);
        setFormData({ name: data.name, status: data.status as 'Active' | 'Inactive' });
        setExistingImage(data.image);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error fetching category:', message);
        setErrors({ server: message || 'Failed to load category.' });
        setTimeout(() => router.push('/categories'), 2000);
      }
    };
    if (!isNaN(categoryId)) fetchCategory();
  }, [categoryId, router]);

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append('name', formData.name);
      if (formData.status) body.append('status', formData.status);
      if (imageFile) body.append('image', imageFile);

      await partialUpdateCategory(categoryId, body);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/categories');
      }, 2000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error updating category:', message);
      setErrors({ server: message || 'Failed to update category.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:text-4xl">Edit Category</h2>
            {errors.server && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                {errors.server}
              </div>
            )}
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100 mt-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter category name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </motion.div>

                {/* Status */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </motion.div>

                {/* Image */}
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-black text-sm font-medium mb-2">
                    <PhotoIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Category Image (optional)
                  </label>
                  {existingImage && (
                    <div className="relative w-24 h-24 mb-4">
                      <Image
                        src={existingImage.startsWith('http') ? existingImage : `${API_BASE_URL}${existingImage}`}
                        alt="Current category"
                        fill
                        className="rounded object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
                </motion.div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                    onClick={() => router.push('/categories')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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
              Category updated successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
