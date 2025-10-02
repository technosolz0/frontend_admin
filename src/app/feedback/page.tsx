'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { TrashIcon, CheckCircleIcon, StarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface FeedbackDTO {
  id: number;
  name: string;
  rating: number;
  comment: string;
  feedbackDate: string;
}

export default function FeedbackPage() {
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock data for demonstration; replace with actual service calls
  const mockFeedbacks: FeedbackDTO[] = [
    { id: 1, name: 'John Doe', rating: 5, comment: 'Great service!', feedbackDate: '2025-09-15' },
    { id: 2, name: 'Jane Smith', rating: 4, comment: 'Good experience overall.', feedbackDate: '2025-09-14' },
    { id: 3, name: 'Bob Johnson', rating: 3, comment: 'Could be better.', feedbackDate: '2025-09-13' },
    { id: 4, name: 'Alice Brown', rating: 5, comment: 'Excellent support!', feedbackDate: '2025-09-12' },
    { id: 5, name: 'Charlie Wilson', rating: 2, comment: 'Needs improvement.', feedbackDate: '2025-09-11' },
    { id: 6, name: 'Diana Evans', rating: 4, comment: 'Satisfactory.', feedbackDate: '2025-09-10' },
    { id: 7, name: 'Eve Taylor', rating: 5, comment: 'Amazing product!', feedbackDate: '2025-09-09' },
    { id: 8, name: 'Frank Miller', rating: 1, comment: 'Disappointing.', feedbackDate: '2025-09-08' },
    { id: 9, name: 'Grace Lee', rating: 4, comment: 'Well done.', feedbackDate: '2025-09-07' },
    { id: 10, name: 'Henry Garcia', rating: 3, comment: 'Average.', feedbackDate: '2025-09-06' },
    { id: 11, name: 'Ivy Martinez', rating: 5, comment: 'Outstanding!', feedbackDate: '2025-09-05' },
    { id: 12, name: 'Jack Rodriguez', rating: 4, comment: 'Good job.', feedbackDate: '2025-09-04' },
    // Add more mock data as needed
  ];

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      // Simulate API call; replace with actual listFeedbacks()
      setAllFeedbacks(mockFeedbacks);
      setTotal(mockFeedbacks.length);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to fetch feedbacks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    if (!searchTerm) return allFeedbacks;
    return allFeedbacks.filter(feedback =>
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allFeedbacks, searchTerm]);

  const feedbacks = useMemo(() => {
    const skip = (currentPage - 1) * limit;
    return filteredFeedbacks.slice(skip, skip + limit);
  }, [filteredFeedbacks, currentPage, limit]);

  useEffect(() => {
    setTotal(filteredFeedbacks.length);
    setCurrentPage(1); // Reset to first page on search
  }, [filteredFeedbacks.length]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    setIsDeleting(id);
    try {
      // Simulate delete; replace with actual deleteFeedback(id)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      setAllFeedbacks(allFeedbacks.filter((f) => f.id !== id));
      setShowSuccess({ message: 'Feedback deleted successfully!', id });
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to delete feedback.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(total / limit)) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  };

  if (isLoading) {
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
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Feedback</h1>
              <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 flex justify-center items-center">
                <div className="text-lg">Loading...</div>
              </div>
            </div>
          </motion.div>
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
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Feedback</h1>
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-400"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Feedback Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feedbacks.map((feedback, index) => (
                      <motion.tr
                        key={feedback.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(currentPage - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{feedback.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">{feedback.comment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{feedback.feedbackDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(feedback.id)}
                            className={`text-red-600 hover:text-red-800 ${
                              isDeleting === feedback.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isDeleting === feedback.id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </motion.button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, total)}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                        {/* Current page indicator */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
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
              {showSuccess.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}