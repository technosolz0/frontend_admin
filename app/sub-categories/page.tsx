'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  SubCategoryDTO,
  listSubCategories,
  deleteSubCategory,
  toggleSubCategoryStatus,
} from '@/services/subCategories';
import { API_BASE_URL } from '@/lib/config';

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategoryDTO[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await listSubCategories();
        setSubCategories(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error fetching subcategories:', message);
        setError(message || 'Failed to fetch subcategories.');
      }
    };
    fetchSubCategories();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubCategories = subCategories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete sub-category with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        await deleteSubCategory(id);
        setSubCategories(subCategories.filter((sc) => sc.id !== id));
        setShowSuccess({ message: 'Sub-category deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error deleting sub-category:', message);
        setError(message || 'Failed to delete sub-category.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (confirm(`Are you sure you want to toggle status for sub-category with ID ${id}?`)) {
      setIsToggling(id);
      try {
        const updatedSubCategory = await toggleSubCategoryStatus(id);
        setSubCategories(subCategories.map((sc) => (sc.id === id ? updatedSubCategory : sc)));
        setShowSuccess({
          message: `Sub-category ${updatedSubCategory.status === 'active' ? 'activated' : 'deactivated'} successfully!`,
          id,
        });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error toggling sub-category status:', message);
        setError(message || 'Failed to toggle sub-category status.');
      } finally {
        setIsToggling(null);
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
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Sub-Category Management</h1>
              {/* Note: In a real app, you might want a 'Create' button here too, but it often requires selecting a parent category first. 
                  For now, we'll assume creation happens via the Categories page or similar flow, or we can add a simple button if needed. 
                  Given the request is about 'fetching and showing', I'll prioritize the list. 
              */}
              <div />
            </div>
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
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
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSubCategories.length > 0 ? (
                    currentSubCategories.map((subCategory, index) => (
                      <motion.tr
                        key={subCategory.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{subCategory.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const imageUrl = subCategory.image && subCategory.image.trim() !== '' ?
                            (subCategory.image.startsWith('http') ? subCategory.image : `${API_BASE_URL}${subCategory.image}`) : null;
                          const isValidUrl = imageUrl ? (() => {
                            try {
                              new URL(imageUrl);
                              return true;
                            } catch {
                              return false;
                            }
                          })() : false;

                          return isValidUrl && imageUrl ? (
                            <div className="relative w-16 h-16 rounded overflow-hidden">
                             <Image
  src={imageUrl}
  alt={subCategory.name}
  fill
  className="object-cover"
  unoptimized
/>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          );
                        })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subCategory.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {subCategory.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          {/* 
                           Edit/Link behavior might depend on routes I haven't fully swept. 
                           Assuming standard edit route /categories/[id]/subcategories/edit/[subId] or similar?
                           For now, I'll link to a generic structure or keep it simple. 
                           The previous tool output showed: categories\[id]\subcategories\edit\[subcategoryId]\page.tsx
                           So editing requires knowing the category ID.
                           My SubCategoryDTO has category_id. Perfect.
                        */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push(`/categories/${subCategory.category_id}/subcategories/edit/${subCategory.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={isDeleting === subCategory.id || isToggling === subCategory.id}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(subCategory.id)}
                            className={`text-red-600 hover:text-red-800 ${isDeleting === subCategory.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            disabled={isDeleting === subCategory.id || isToggling === subCategory.id}
                          >
                            {isDeleting === subCategory.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <TrashIcon className="w-5 h-5" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleStatus(subCategory.id)}
                            className={`text-yellow-600 hover:text-yellow-800 ${isToggling === subCategory.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            disabled={isDeleting === subCategory.id || isToggling === subCategory.id}
                          >
                            {isToggling === subCategory.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-yellow-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <NoSymbolIcon className="w-5 h-5" />
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No sub-categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                  <span className="ml-2 text-gray-500">({subCategories.length} total)</span>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}

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
