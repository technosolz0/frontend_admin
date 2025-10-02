'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
  listAccountDeleteRequests,
  deleteAccountRequest,
} from '@/services/accountRequests';

interface AccountDeleteRequestDTO {
  id: number;
  name: string;
  phone: string;
  reason: string;
  requestDate: string;
  role: string;
  image?: string;
}

interface PagedAccountDeleteRequests {
  data: AccountDeleteRequestDTO[];
  total: number;
}

export default function AccountDeleteRequestsPage() {
  const [requests, setRequests] = useState<AccountDeleteRequestDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  const router = useRouter();

  const fetchRequests = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const data = await listAccountDeleteRequests(page, limit, {
        name: searchName,
        role: searchRole,
        phone: searchPhone,
      });
      setRequests(data.data);
      setTotal(data.total);
      setCurrentPage(page);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    setIsDeleting(id);
    try {
      await deleteAccountRequest(id);
      await fetchRequests(currentPage);
      setShowSuccess({ message: 'Request deleted successfully!', id });
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(total / limit)) {
      fetchRequests(page);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
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
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">Delete Requests</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Search by Name"
                className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <select
                className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>
              <input
                type="text"
                placeholder="Search by Phone"
                className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <button
                onClick={() => fetchRequests(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md transition duration-200"
              >
                Search
              </button>
            </div>

            {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">{error}</div>}

            {isLoading ? (
              <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 flex justify-center items-center">
                <div className="text-lg">Loading...</div>
              </div>
            ) : (
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border bg-gradient-to-r from-blue-600 to-blue-700"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Request Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((req, index) => (
                        <motion.tr
                          key={req.id}
                          custom={index}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          className="hover:bg-blue-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * limit + index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{req.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req.requestDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(req.id)}
                              className={`text-red-600 hover:text-red-800 ${
                                isDeleting === req.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={isDeleting === req.id}
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
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </motion.button>
                    </div>

                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, total)}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                      </p>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) pageNum = i + 1;
                          else if (currentPage <= 3) pageNum = i + 1;
                          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                          else pageNum = currentPage - 2 + i;
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
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
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </nav>
                    </div>
                  </div>
                )}
              </motion.div>
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
