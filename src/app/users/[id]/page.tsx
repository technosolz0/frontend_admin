'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Mock fetching user by ID (replace with API call in real app)
  const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8"
        >
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">User Details</h1>
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Name
                </div>
                <p className="text-gray-900 text-base">{user.name}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Email
                </div>
                <p className="text-gray-900 text-base">{user.email}</p>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Role
                </div>
                <p className="text-gray-900 text-base">{user.role}</p>
              </motion.div>
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'Blocked'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.status}
                </span>
              </motion.div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/users')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                >
                  Back to Users
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}