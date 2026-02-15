'use client';

import {
  listUsers,
  deleteUser,
  toggleUserStatus,
} from '@/services/users';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import SearchFilter from '@/components/SearchFilter';
import Pagination from '@/components/Pagination';

interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  status: 'active' | 'blocked';
  is_verified?: boolean;
  profile_pic?: string;
  last_login_at?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const usersPerPage = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const skip = (currentPage - 1) * usersPerPage;
      const response = await listUsers(skip, usersPerPage, searchTerm, statusFilter);

      console.log('API Response:', response); // Debug log

      // Handle the response structure from backend
      if (response && response.success) {
        setUsers(response.users || []);
        setTotalUsers(response.total || 0);

        const calculatedTotalPages = Math.ceil((response.total || 0) / usersPerPage);
        setTotalPages(calculatedTotalPages || 1);
      } else {
        // Handle case where API returns but without success flag
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
        setError(response?.message || 'Failed to fetch users');
      }

    } catch {
      setError('Failed to fetch users. Please try again.');

      // Reset state on error
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearFilters = () => {
    setSearch('');
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete user with ID ${id}?`)) return;

    setIsDeleting(id);
    setError(null);

    try {
      const response = await deleteUser(id);

      if (response && response.success) {
        setUsers(users.filter((user) => user.id !== id));
        setShowSuccess({ message: 'User deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);

        // Refetch if current page becomes empty
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers();
        }
      } else {
        setError(response?.message || 'Failed to delete user');
      }
    } catch (err: unknown) {
      console.error('Error deleting user:', err);

      if (err instanceof Error) {
        setError(err.message || 'Failed to delete user.');
      } else {
        setError('Failed to delete user. Please try again.');
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'activate'} this user?`)) return;

    setIsToggling(id);
    setError(null);

    try {
      const response = await toggleUserStatus(id);

      if (response && response.success && response.user) {
        setUsers(users.map((user) => (user.id === id ? response.user : user)));
        setShowSuccess({
          message: `User ${response.user.status === 'active' ? 'activated' : 'blocked'} successfully!`,
          id,
        });
        setTimeout(() => setShowSuccess(null), 2000);
      } else {
        setError(response?.message || 'Failed to toggle user status');
      }
    } catch (err: unknown) {
      console.error('Error toggling user status:', err);

      if (err instanceof Error) {
        setError(err.message || 'Failed to toggle user status.');
      } else {
        setError('Failed to toggle user status. Please try again.');
      }
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
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:text-4xl">User Management</h2>

            <SearchFilter
              searchPlaceholder="Search users by name, email, or mobile..."
              searchValue={search}
              onSearchChange={setSearch}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  value: statusFilter,
                  options: [
                    { value: 'active', label: 'Active' },
                    { value: 'blocked', label: 'Blocked' }
                  ],
                  onChange: setStatusFilter
                }
              ]}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              hasActiveFilters={!!(search || statusFilter)}
              onClearFilters={clearFilters}
            />


            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 flex items-center justify-between"
              >
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </motion.div>
            )}

            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100 mt-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          custom={index}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          className="hover:bg-blue-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/users/${user.id}`)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {user.name}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.mobile || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => router.push(`/users/edit/${user.id}`)}
                              className="text-blue-600 hover:text-blue-800"
                              disabled={isDeleting === user.id || isToggling === user.id}
                              title="Edit user"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(user.id)}
                              className={`text-red-600 hover:text-red-800 ${isDeleting === user.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              disabled={isDeleting === user.id || isToggling === user.id}
                              title="Delete user"
                            >
                              {isDeleting === user.id ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-red-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <TrashIcon className="w-5 h-5" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleStatus(user.id)}
                              className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                                } ${isToggling === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isDeleting === user.id || isToggling === user.id}
                              title={user.status === 'active' ? 'Block user' : 'Activate user'}
                            >
                              {isToggling === user.id ? (
                                <svg
                                  className="animate-spin h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <NoSymbolIcon className="w-5 h-5" />
                              )}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
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
