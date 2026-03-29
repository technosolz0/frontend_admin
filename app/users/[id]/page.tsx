'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  PhoneIcon, 
  IdentificationIcon, 
  DevicePhoneMobileIcon, 
  MapPinIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  GlobeAltIcon,
  KeyIcon,
  FingerPrintIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <LoadingSpinner message="Loading User Profile..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600">Error: {error || 'User not found'}</h2>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-6 sm:p-8 max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 bg-white shadow-sm border border-gray-200 rounded-full hover:bg-gray-50 transition"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Profile</h1>
                <p className="text-gray-500 font-medium flex items-center gap-1">
                  System ID: <span className="text-blue-600 font-mono">#USR-{user.id}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                 onClick={() => router.push(`/users/edit/${user.id}`)}
                 className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition"
              >
                Edit Details
              </button>
              <button 
                 className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition ${
                   user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                 }`}
              >
                {user.status === 'active' ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Profile & Account */}
            <div className="lg:col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                       <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
                         <Image 
                           src={getFullUrl(user.profile_pic) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} 
                           alt={user.name}
                           fill
                           className="object-cover"
                         />
                       </div>
                    </div>
                </div>
                <div className="pt-16 pb-8 px-6 text-center">
                   <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                   <p className="text-indigo-600 font-bold mb-4">{user.is_superuser ? 'System Administrator' : 'Platform Customer'}</p>
                   
                   <div className="flex justify-center gap-2 mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.is_verified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                   </div>

                   <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Account Since</p>
                        <p className="text-sm font-bold text-gray-700">MAR 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Role Type</p>
                        <p className="text-sm font-bold text-gray-700">{user.is_superuser ? 'ADMIN' : 'USER'}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Quick Actions / Integration */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 p-6">
                 <h3 className="font-bold text-gray-800 text-lg mb-4">Internal Identifiers</h3>
                 <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                       <p className="text-xs text-gray-400 font-bold uppercase mb-1">Device ID Reference</p>
                       <p className="text-sm font-mono text-gray-700 break-all">{user.device_id || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                       <p className="text-xs text-gray-400 font-bold uppercase mb-1">New FCM Token</p>
                       <p className="text-[10px] font-mono text-blue-600 break-all leading-tight">
                         {user.new_fcm_token ? user.new_fcm_token.substring(0, 100) + '...' : 'Not Registered'}
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column - Detailed Profile */}
            <div className="lg:col-span-8 space-y-8">
               {/* Contact Information */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <IdentificationIcon className="w-6 h-6 text-indigo-600" />
                        Personal Information
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     <DetailItem icon={<EnvelopeIcon className="w-5 h-5" />} label="Email Address" value={user.email} />
                     <DetailItem icon={<PhoneIcon className="w-5 h-5" />} label="Mobile Number" value={user.mobile} />
                     <DetailItem icon={<UserIcon className="w-5 h-5" />} label="Display Name" value={user.name} />
                     <DetailItem icon={<ShieldCheckIcon className="w-5 h-5" />} label="Security Level" value={user.is_superuser ? 'Level 10 (Admin)' : 'Level 1 (Basic)'} />
                  </div>
               </div>

               {/* Device & OS Details */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <DevicePhoneMobileIcon className="w-6 h-6 text-purple-500" />
                        Hardware & Environment
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                     <HardwareCard icon={<CpuChipIcon className="w-5 h-5" />} label="OS Version" value={user.os_version || 'N/A'} sub="Platform OS" />
                     <HardwareCard icon={<GlobeAltIcon className="w-5 h-5" />} label="App Version" value={user.app_version || 'N/A'} sub="Installed Release" />
                     <HardwareCard icon={<FingerPrintIcon className="w-5 h-5" />} label="Device Type" value={user.device_type || 'N/A'} sub="Access Hardware" />
                  </div>
               </div>

               {/* Activity Logs */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-green-600" />
                        Session Analytics
                     </h3>
                  </div>
                  <div className="p-8 space-y-6">
                     <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 flex gap-4 p-5 rounded-2xl bg-green-50/50 border border-green-100">
                           <div className="p-3 bg-green-600 rounded-xl self-start"><ClockIcon className="w-6 h-6 text-white" /></div>
                           <div>
                              <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Most Recent Access</p>
                              <p className="text-xl font-black text-gray-900">
                                 {user.last_login_at ? new Date(user.last_login_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never Logged In'}
                              </p>
                           </div>
                        </div>
                        <div className="flex-1 flex gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                           <div className="p-3 bg-blue-600 rounded-xl self-start"><GlobeAltIcon className="w-6 h-6 text-white" /></div>
                           <div>
                              <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1">Incoming IP Address</p>
                              <p className="text-xl font-black text-gray-900">{user.last_login_ip || 'X.X.X.X'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex gap-4">
      <div className="p-2 bg-gray-100 text-gray-500 rounded-xl h-fit">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-0.5">{label}</p>
        <p className="text-base font-bold text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function HardwareCard({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-4">{icon}</div>
      <p className="text-xs font-black text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
    </div>
  );
}
