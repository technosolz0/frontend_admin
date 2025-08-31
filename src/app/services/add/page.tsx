'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import {
  listCategories,
  listSubcategories,
  createService,
} from '@/services/services';
import { CategoryDTO, SubcategoryDTO, CreateServiceDTO } from '@/services/services';

export default function AddServicePage() {
  const [formData, setFormData] = useState<CreateServiceDTO>({
    name: '',
    category_id: '',
    sub_category_id: '',
    description: '',
    price: 0,
    status: 'Active',
  });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryDTO[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [cats, subs] = await Promise.all([
        listCategories(),
        listSubcategories(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch (err) {
      console.error(err);
      alert('Failed to load category data.');
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.sub_category_id) newErrors.sub_category_id = 'Subcategory is required';
    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const serviceData: CreateServiceDTO = {
        ...formData,
        image: imageFile,
      };

      await createService(serviceData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        category_id: '',
        sub_category_id: '',
        description: '',
        price: 0,
        status: 'Active',
      });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/services');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to add service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
      // Reset subcategory when category changes
      ...(name === 'category_id' ? { sub_category_id: '' } : {}),
    }));
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === Number(formData.category_id)
  );

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.3 },
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">Add New Service</h1>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
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
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter service name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </motion.div>

                {/* Category */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
                </motion.div>

                {/* Subcategory */}
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Subcategory
                  </label>
                  <select
                    name="sub_category_id"
                    value={formData.sub_category_id}
                    onChange={handleChange}
                    disabled={isSubmitting || !formData.category_id}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
                  >
                    <option value="">Select subcategory</option>
                    {filteredSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.sub_category_id && <p className="text-sm text-red-600 mt-1">{errors.sub_category_id}</p>}
                </motion.div>

                {/* Price */}
                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
                    disabled={isSubmitting}
                    placeholder="Enter price"
                  />
                  {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                </motion.div>

                {/* Description */}
                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Enter service description"
                  />
                </motion.div>

                {/* Image */}
                <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <PhotoIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-black block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isSubmitting}
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Service preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Status */}
                <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 bg-gray-50 py-3 px-4"
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
                    onClick={() => router.push('/services')}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Adding…' : 'Add Service'}
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
              Service added successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}