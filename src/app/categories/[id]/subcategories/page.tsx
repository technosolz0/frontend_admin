'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { listSubCategories, deleteSubCategory, toggleSubCategoryStatus, SubCategoryDTO } from '@/services/subCategories';
import { API_BASE_URL } from '@/lib/config';

export default function SubcategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [subcategories, setSubcategories] = useState<SubCategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const allSubcategories = await listSubCategories();
        // Filter subcategories by category_id
        const categorySubcategories = allSubcategories.filter(
          sub => sub.category_id === parseInt(categoryId)
        );
        setSubcategories(categorySubcategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load subcategories';
        alert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete this subcategory?`)) {
      setIsDeleting(id);
      try {
        await deleteSubCategory(id);
        setSubcategories(prev => prev.filter(subcategory => subcategory.id !== id));
        setShowSuccess({ message: 'Subcategory deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete subcategory';
        alert(errorMessage);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    setIsToggling(id);
    try {
      const updatedSubcategory = await toggleSubCategoryStatus(id);
      setSubcategories(prev => 
        prev.map(sub => 
          sub.id === id ? updatedSubcategory : sub
        )
      );
      setShowSuccess({ 
        message: `Subcategory status updated to ${updatedSubcategory.status}!`, 
        id 
      });
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (error) {
      console.error('Error toggling subcategory status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subcategory status';
      alert(errorMessage);
    } finally {
      setIsToggling(null);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600 text-lg">Loading subcategories...</span>
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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Subcategory Management</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/categories/${categoryId}/subcategories/add`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                Add New Subcategory
              </motion.button>
            </div>

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
                  {subcategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No subcategories found for this category.
                      </td>
                    </tr>
                  ) : (
                    subcategories.map((subcategory, index) => (
                      <motion.tr
                        key={subcategory.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subcategory.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subcategory.image && (
                          <div className="relative w-16 h-16 rounded overflow-hidden">
                            <img
                              src={`${API_BASE_URL}${subcategory.image}`}
                              alt={subcategory.name}
                          
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleStatus(subcategory.id)}
                            disabled={isToggling === subcategory.id}
                            className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-all duration-200 ${
                              subcategory.status === 'active' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } ${isToggling === subcategory.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isToggling === subcategory.id ? (
                              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              subcategory.status === 'active' ? (
                                <CheckCircleIcon className="w-3 h-3" />
                              ) : (
                                <XCircleIcon className="w-3 h-3" />
                              )
                            )}
                          {subcategory.status.charAt(0).toUpperCase() + subcategory.status.slice(1)}

                          </motion.button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push(`/categories/${categoryId}/subcategories/edit/${subcategory.id}`)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            disabled={isDeleting === subcategory.id || isToggling === subcategory.id}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(subcategory.id)}
                            className={`text-red-600 hover:text-red-800 transition-colors duration-200 ${
                              isDeleting === subcategory.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isDeleting === subcategory.id || isToggling === subcategory.id}
                          >
                            {isDeleting === subcategory.id ? (
                              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <TrashIcon className="w-5 h-5" />
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
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