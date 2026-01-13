'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { TagIcon, CubeIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  image: string;
  status: 'active' | 'inactive';
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function for auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch category`);
        }
        const data = await response.json();
        setCategory(data);
        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('Error fetching category:', err);
        } else {
          setError('Failed to load category data. Please try again.');
        }
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

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
  if (error || !category) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              {error || 'Category Not Found'}
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
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Category Details</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/categories/edit/${category.id}`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                Edit Category
              </motion.button>
            </div>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Information</h2>
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Category ID
                </div>
                <p className="text-lg text-gray-900">{category.id}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CubeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Name
                </div>
                <p className="text-lg text-gray-900">{category.name}</p>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <PhotoIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Image
                </div>
                {category.image ? (
                  <div className="mt-2">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <a
                      href={category.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-4"
                    >
                      View Full Image
                    </a>
                  </div>
                ) : (
                  <p className="text-lg text-gray-500">No image available</p>
                )}
              </motion.div>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    category.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                </span>
              </motion.div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/categories')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                >
                  Back to Categories
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
