'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon, CheckCircleIcon, PhoneIcon, IdentificationIcon, DevicePhoneMobileIcon, MapPinIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: 'active' | 'blocked';
  is_verified: boolean;
  is_superuser: boolean;
  profile_pic?: string;
  old_fcm_token?: string;
  new_fcm_token?: string;
  device_id?: string;
  device_type?: string;
  os_version?: string;
  app_version?: string;
  last_login_at?: string;
  last_login_ip?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function for auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch user`);
        }
        const data = await response.json();
        setUser(data);
        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('Error fetching user:', err);
        } else {
          setError('Failed to load user data. Please try again.');
        }
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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
  if (error || !user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              {error || 'User Not Found'}
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
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/users')}
                className="p-2 bg-white shadow-md rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </motion.button>
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">User Details</h1>
            </div>

            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Personal Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Name
                </div>
                <p className="text-lg text-gray-900">{user.name}</p>
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Email
                </div>
                <p className="text-lg text-gray-900">{user.email}</p>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <PhoneIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Mobile
                </div>
                <p className="text-lg text-gray-900">{user.mobile}</p>
              </motion.div>
              {user.profile_pic && (
                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <IdentificationIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Profile Picture
                  </div>
                  <div className="mt-2">
                    {user.profile_pic ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <img
                          src={user.profile_pic}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={user.profile_pic}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 group"
                        >
                          <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-sm">View Full</span>
                        </a>
                      </div>
                    ) : (
                      <p className="text-lg text-gray-400 italic">No profile picture</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Account Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Account Information</h2>
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Role
                </div>
                <p className="text-lg text-gray-900">{user.is_superuser ? 'Super Admin' : 'User'}</p>
              </motion.div>
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </motion.div>
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Email Verified
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${user.is_verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {user.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </motion.div>

              {/* Device Info */}
              {(user.device_id || user.device_type || user.os_version || user.app_version) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Device Information</h2>
                  {user.device_id && (
                    <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Device ID
                      </div>
                      <p className="text-lg text-gray-900">{user.device_id}</p>
                    </motion.div>
                  )}
                  {user.device_type && (
                    <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Device Type
                      </div>
                      <p className="text-lg text-gray-900">{user.device_type}</p>
                    </motion.div>
                  )}
                  {user.os_version && (
                    <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-blue-600" />
                        OS Version
                      </div>
                      <p className="text-lg text-gray-900">{user.os_version}</p>
                    </motion.div>
                  )}
                  {user.app_version && (
                    <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-blue-600" />
                        App Version
                      </div>
                      <p className="text-lg text-gray-900">{user.app_version}</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* Login Info */}
              {(user.last_login_at || user.last_login_ip) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Login Information</h2>
                  {user.last_login_at && (
                    <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Last Login
                      </div>
                      <p className="text-lg text-gray-900">{new Date(user.last_login_at).toLocaleString()}</p>
                    </motion.div>
                  )}
                  {user.last_login_ip && (
                    <motion.div custom={12} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Last Login IP
                      </div>
                      <p className="text-lg text-gray-900">{user.last_login_ip}</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* FCM Tokens */}
              {(user.new_fcm_token || user.old_fcm_token) && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">FCM Tokens</h2>
                  {user.new_fcm_token && (
                    <motion.div custom={13} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <IdentificationIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Current FCM Token
                      </div>
                      <p className="text-lg text-gray-900 break-all">{user.new_fcm_token}</p>
                    </motion.div>
                  )}
                  {user.old_fcm_token && (
                    <motion.div custom={14} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <IdentificationIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Previous FCM Token
                      </div>
                      <p className="text-lg text-gray-900 break-all">{user.old_fcm_token}</p>
                    </motion.div>
                  )}
                </>
              )}

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
