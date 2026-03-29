'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  TagIcon, 
  CubeIcon, 
  UserIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  MapPinIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  TicketIcon,
  CreditCardIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/api';
import { API_BASE_URL } from '@/lib/config';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

interface Booking {
  id: number;
  user_id: number;
  serviceprovider_id: number;
  category_id: number;
  subcategory_id: number;
  scheduled_time?: string;
  address: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
  created_at: string;
  otp?: string;
  otp_created_at?: string;
  // Related data
  user_name?: string;
  user_email?: string;
  user_mobile?: string;
  user_profile_pic?: string;
  service_provider_name?: string;
  service_provider_profile_pic?: string;
  category_name?: string;
  subcategory_name?: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await apiCall<Booking>(`/api/bookings/${bookingId}`);
        setBooking(data);
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <LoadingSpinner message="Locating Booking..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600">Error: {error || 'Booking not found'}</h2>
            <button onClick={() => router.push('/bookings')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md">
              Return to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

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
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Booking Details</h1>
                <p className="text-gray-500 font-medium flex items-center gap-1">
                  Ticket Index: <span className="text-blue-600 font-mono font-bold">#ORD-{booking.id}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
              <button className="p-2 bg-blue-600 shadow-lg text-white rounded-xl hover:bg-blue-700 transition">
                 <TicketIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - People Involved */}
            <div className="lg:col-span-4 space-y-8">
              {/* Customer Miniature Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 p-6 hover:border-blue-100 transition duration-300">
                <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Customer Details</p>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
                      <Image 
                        src={getFullUrl(booking.user_profile_pic) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(booking.user_name || 'U')} 
                        alt={booking.user_name || 'U'}
                        fill
                        className="object-cover"
                      />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-900 truncate">{booking.user_name || 'Anonymous User'}</h3>
                      <p className="text-xs text-blue-600 font-bold mb-1 truncate">{booking.user_email}</p>
                      <button 
                         onClick={() => router.push(`/users/${booking.user_id}`)}
                         className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter hover:bg-indigo-100 transition"
                      >
                         View Full Profile
                      </button>
                   </div>
                </div>
              </div>

              {/* Provider Miniature Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 p-6 hover:border-blue-100 transition duration-300">
                <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Service Provider</p>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
                      <Image 
                        src={getFullUrl(booking.service_provider_profile_pic) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(booking.service_provider_name || 'S')} 
                        alt={booking.service_provider_name || 'S'}
                        fill
                        className="object-cover"
                      />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-gray-900 truncate">{booking.service_provider_name || 'Unassigned'}</h3>
                      <p className="text-xs text-green-600 font-bold mb-1">Authenticated Vendor</p>
                      <button 
                         onClick={() => router.push(`/providers/${booking.serviceprovider_id}`)}
                         className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter hover:bg-green-100 transition"
                      >
                         Check Service Stats
                      </button>
                   </div>
                </div>
              </div>

              {/* Security & OTP Section */}
              <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-indigo-100 text-xs font-black uppercase tracking-widest">Security Token (OTP)</h3>
                    <ShieldCheckIcon className="w-6 h-6 text-indigo-300" />
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                    <p className="text-5xl font-black tracking-[1rem] ml-4 transition hover:tracking-[1.2rem] duration-500">
                      {booking.otp || '----'}
                    </p>
                    <p className="text-[10px] text-indigo-200 font-bold mt-4 uppercase tracking-tighter">
                       Generated at: {booking.otp_created_at ? new Date(booking.otp_created_at).toLocaleTimeString() : 'N/A'}
                    </p>
                 </div>
              </div>
            </div>

            {/* Right Column - Service Details */}
            <div className="lg:col-span-8 space-y-8">
               {/* Work Order Breakdown */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <CubeIcon className="w-6 h-6 text-blue-600" />
                        Work Order Breakdown
                     </h3>
                     <div className="flex gap-2">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-black">{booking.category_name}</span>
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-xl text-xs font-black">{booking.subcategory_name}</span>
                     </div>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                     <SummaryItem icon={<TagIcon />} label="Requested Service" value={booking.subcategory_name || 'N/A'} sub="Primary Task" />
                     <SummaryItem icon={<CalendarIcon />} label="Execution Schedule" value={booking.scheduled_time ? new Date(booking.scheduled_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'ASAP Request'} sub="Deployment Time" />
                     <SummaryItem icon={<ClockIcon />} label="Creation Timestamp" value={new Date(booking.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} sub="System Log Entry" />
                     <SummaryItem icon={<CurrencyRupeeIcon />} label="Estimated Charge" value="Consultancy Pricing" sub="Pricing Model" />
                  </div>
               </div>

               {/* Deployment Location */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6 text-red-500" />
                        Service Deployment Location
                     </h3>
                  </div>
                  <div className="p-8">
                     <div className="flex gap-6 items-start">
                        <div className="hidden sm:block p-4 bg-red-50 rounded-2xl">
                           <MapPinIcon className="w-10 h-10 text-red-600" />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Address</p>
                           <p className="text-xl font-bold text-gray-800 leading-relaxed mb-4">
                              {booking.address}
                           </p>
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 cursor-pointer hover:bg-blue-100 transition">
                              <MapPinIcon className="w-4 h-4" />
                              View on Open Street Map
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Payment Summary Placeholder */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <CreditCardIcon className="w-6 h-6 text-green-600" />
                        Fiscal & Settlement
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatBox label="Base Service" value="TBD" sub="Standard rate" />
                     <StatBox label="Tax Component" value="₹0.00" sub="Included" />
                     <StatBox label="Total Payable" value="Invoicing..." sub="Estimated" />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="p-3 bg-gray-100 text-gray-500 rounded-2xl h-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
         {icon && <div className="w-6 h-6">{icon}</div>}
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-gray-900 line-clamp-2">{value}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase">{sub}</p>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all duration-300">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 font-bold">{sub}</p>
    </div>
  );
}
