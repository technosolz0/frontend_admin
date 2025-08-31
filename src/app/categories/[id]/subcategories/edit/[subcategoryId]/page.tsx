'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getSubCategory, partialUpdateSubCategory } from '@/services/subCategories';

interface FormData {
  name: string;
  status: 'Active' | 'Inactive';
  image: File | null;
}

export default function EditSubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const subcategoryId = params.subcategoryId as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: 'Active',
    image: null,
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const subcategory = await getSubCategory(parseInt(subcategoryId));
        setFormData({
          name: subcategory.name,
          status: subcategory.status,
          image: null,
        });
        setCurrentImage(subcategory.image);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load subcategory';
        alert(errorMessage);
        router.push(`/categories/${categoryId}/subcategories`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategory();
  }, [subcategoryId, categoryId, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('category_id', categoryId);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await partialUpdateSubCategory(parseInt(subcategoryId), formDataToSend);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push(`/categories/${categoryId}/subcategories`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subcategory';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-gray-600">Loading subcategory...</span>
                </div>
              </div>
            </div>
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">Edit Subcategory</h1>
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
                    onChange={handleInputChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter subcategory name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </motion.div>

                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="image" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <PhotoIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Image
                  </label>
                  
                  {/* Current image */}
                  {currentImage && !previewUrl && (
                    <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <Image src={currentImage} alt="Current" fill className="object-cover" />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                  />
                  
                  {/* Preview image */}
                  {previewUrl && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  
                  {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                </motion.div>

                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
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
                    onClick={() => router.push(`/categories/${categoryId}/subcategories`)}
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
              Subcategory updated successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
