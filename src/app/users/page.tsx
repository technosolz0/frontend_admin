// src\app\users\page.tsx (UsersPage.tsx, unchanged except for error handling)
'use client';
import {
  listUsers,
  deleteUser,
  toggleUserStatus,
  UserDTO,
} from '@/services/users';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'blocked';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<{ message: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await listUsers();
        setUsers(users);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users.');
        console.error('Fetch users error:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete user with ID ${id}?`)) {
      setIsDeleting(id);
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        setShowSuccess({ message: 'User deleted successfully!', id });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError(error.message || 'Failed to delete user.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (confirm(`Are you sure you want to toggle status for user with ID ${id}?`)) {
      setIsToggling(id);
      try {
        const updatedUser = await toggleUserStatus(id);
        setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
        setShowSuccess({
          message: `User ${updatedUser.status === 'active' ? 'activated' : 'blocked'} successfully!`,
          id,
        });
        setTimeout(() => setShowSuccess(null), 2000);
      } catch (error: any) {
        console.error('Error toggling user status:', error);
        setError(error.message || 'Failed to toggle user status.');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">User Management</h1>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
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
                        >
                          <PencilIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(user.id)}
                          className={`text-red-600 hover:text-red-800 ${
                            isDeleting === user.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isDeleting === user.id || isToggling === user.id}
                        >
                          {isDeleting === user.id ? (
                            <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                          className={`text-yellow-600 hover:text-yellow-800 ${
                            isToggling === user.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isDeleting === user.id || isToggling === user.id}
                        >
                          {isToggling === user.id ? (
                            <svg className="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <NoSymbolIcon className="w-5 h-5" />
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
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