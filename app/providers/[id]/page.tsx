'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  TagIcon, CubeIcon, EnvelopeIcon, CheckCircleIcon, 
  WrenchScrewdriverIcon, HomeIcon, BanknotesIcon, 
  IdentificationIcon, MapPinIcon, ArrowLeftIcon,
  UserGroupIcon, CalendarIcon, PhoneIcon,
  StarIcon, ArrowUpRightIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ReferralInfo {
  id: number;
  full_name: string;
  referral_code: string;
  status: string;
  phone?: string;
  created_at?: string;
}

interface ServiceProvider {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  identity_doc_type: string | null;
  identity_doc_number: string | null;
  identity_doc_url: string | null;
  bank_doc_type: string | null;
  bank_doc_number: string | null;
  bank_doc_url: string | null;
  address_doc_type: string | null;
  address_doc_number: string | null;
  address_doc_url: string | null;
  category_id: number | null;
  category_name: string | null;
  profile_pic: string | null;
  status: string;
  admin_status: string;
  work_status: string;
  subcategory_charges: { subcategory_id: number; subcategory_name: string; service_charge: number }[];
  referral_code: string | null;
  referred_by: ReferralInfo | null;
  referrals_made: ReferralInfo[];
}

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/${providerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch provider details');
        const data = await response.json();
        setProvider(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64"><Navbar /><div className="flex justify-center items-center h-[calc(100vh-100px)]"><LoadingSpinner message="Loading Profile..." /></div></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64"><Navbar /><div className="p-8 text-center"><h2 className="text-2xl font-bold text-red-600">Error: {error || 'Provider not found'}</h2><button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Back</button></div></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
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
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Provider Profile</h1>
                <p className="text-gray-500 font-medium flex items-center gap-1">
                  Vendor ID: <span className="text-blue-600">#VND-{provider.id}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                 onClick={() => router.push(`/providers/edit/${provider.id}`)}
                 className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition"
              >
                Edit Profile
              </button>
              <button 
                 className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition ${
                   provider.admin_status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                 }`}
              >
                {provider.admin_status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Profile Summary & Referral */}
            <div className="lg:col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                       <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
                         <Image 
                           src={getFullUrl(provider.profile_pic) || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(provider.full_name)} 
                           alt={provider.full_name}
                           fill
                           className="object-cover"
                         />
                       </div>
                    </div>
                </div>
                <div className="pt-16 pb-8 px-6 text-center">
                   <h2 className="text-2xl font-bold text-gray-900">{provider.full_name}</h2>
                   <p className="text-blue-600 font-bold mb-4">{provider.category_name || 'No Category'}</p>
                   
                   <div className="flex justify-center gap-2 mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        provider.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {provider.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        provider.work_status === 'work_on' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {provider.work_status === 'work_on' ? 'Active Duty' : 'Off Duty'}
                      </span>
                   </div>

                   <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Referral Code</p>
                        <p className="text-lg font-black text-gray-800 tracking-widest">{provider.referral_code || '---'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Work Status</p>
                        <p className="text-sm font-bold text-gray-700">{provider.admin_status.toUpperCase()}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Referral Made Section */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg"><UserGroupIcon className="w-6 h-6 text-purple-600" /></div>
                    <h3 className="font-bold text-gray-800 text-lg">Referrals Made</h3>
                 </div>
                 <div className="space-y-4">
                    {provider.referrals_made.length > 0 ? (
                      provider.referrals_made.map(ref => (
                        <div key={ref.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                                {ref.full_name[0]}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-gray-800">{ref.full_name}</p>
                                 <p className="text-[10px] text-gray-500">{ref.referral_code}</p>
                              </div>
                           </div>
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                             ref.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {ref.status}
                           </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-400 italic text-sm">No referrals made yet.</div>
                    )}
                 </div>
              </div>

              {/* Referred By Section */}
              {provider.referred_by && (
                 <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
                    <h3 className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-4">Referred By</h3>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold">
                          {provider.referred_by.full_name[0]}
                       </div>
                       <div>
                          <p className="font-bold text-lg">{provider.referred_by.full_name}</p>
                          <p className="text-indigo-200 text-xs flex items-center gap-1 font-mono uppercase tracking-tighter">
                            <TagIcon className="w-3 h-3" /> {provider.referred_by.referral_code}
                          </p>
                       </div>
                    </div>
                 </div>
              )}
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-8 space-y-8">
               {/* Contact & Address Information */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                        Professional Details
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     <DetailItem icon={<EnvelopeIcon className="w-5 h-5" />} label="Email Address" value={provider.email} />
                     <DetailItem icon={<PhoneIcon className="w-5 h-5" />} label="Phone Number" value={provider.phone} />
                     <DetailItem icon={<MapPinIcon className="w-5 h-5" />} label="Location" value={`${provider.city || 'N/A'}, ${provider.state || 'N/A'}`} />
                     <DetailItem icon={<HomeIcon className="w-5 h-5" />} label="Service Area Pincode" value={provider.pincode} />
                     <div className="md:col-span-2">
                        <DetailItem icon={<MapPinIcon className="w-5 h-5" />} label="Full Address" value={provider.address} />
                     </div>
                  </div>
               </div>

               {/* Work & Charges */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-6 h-6 text-orange-500" />
                        Service Specialization
                     </h3>
                  </div>
                  <div className="p-8">
                     <div className="mb-6">
                        <p className="text-xs font-black uppercase text-gray-400 mb-2">Primary Category</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-2xl font-bold border border-orange-100">
                           <CubeIcon className="w-4 h-4" />
                           {provider.category_name}
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {provider.subcategory_charges.map(charge => (
                          <div key={charge.subcategory_id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex justify-between items-center group hover:border-blue-200 hover:shadow-md transition duration-300">
                             <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Subcategory</p>
                                <p className="font-bold text-gray-800">{charge.subcategory_name}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Charge</p>
                                <p className="text-lg font-black text-blue-600">₹{charge.service_charge}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Bank & Payment Info */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <BanknotesIcon className="w-6 h-6 text-green-600" />
                        Payout Details
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                     <DetailItem icon={<span className="font-bold text-xs">AC</span>} label="Beneficiary Name" value={provider.account_holder_name} />
                     <DetailItem icon={<span className="font-bold text-xs">#NO</span>} label="Account Number" value={provider.account_number} />
                     <DetailItem icon={<span className="font-bold text-xs">IFSC</span>} label="IFSC Code" value={provider.ifsc_code} />
                     <DetailItem icon={<span className="font-bold text-xs">UPI</span>} label="UPI Identification" value={provider.upi_id} />
                  </div>
               </div>

               {/* Verification Proofs */}
               <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                        <IdentificationIcon className="w-6 h-6 text-red-500" />
                        Verification Proofs
                     </h3>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                     <DocCard title="Identity Proof" type={provider.identity_doc_type} url={getFullUrl(provider.identity_doc_url)} num={provider.identity_doc_number} />
                     <DocCard title="Address Proof" type={provider.address_doc_type} url={getFullUrl(provider.address_doc_url)} num={provider.address_doc_number} />
                     <DocCard title="Bank Proof" type={provider.bank_doc_type} url={getFullUrl(provider.bank_doc_url)} num={provider.bank_doc_number} />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-components
function DetailItem({ icon, label, value }: { icon: any, label: string, value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-gray-700 break-words">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

function DocCard({ title, type, url, num }: { title: string, type: string | null, url: string | null, num: string | null }) {
  return (
    <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col items-center">
       <p className="text-[10px] font-black uppercase text-gray-400 mb-3">{title}</p>
       <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner mb-3 bg-gray-200 flex items-center justify-center">
          {url ? (
            <>
              <Image src={url} alt={title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                 <a href={url} target="_blank" rel="noreferrer" className="text-white text-[10px] font-bold uppercase tracking-widest border border-white px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md">View Original</a>
              </div>
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">No Document</span>
          )}
       </div>
       <div className="text-center w-full">
          <p className="text-sm font-bold text-gray-800 truncate">{type || 'N/A'}</p>
          <p className="text-[10px] font-mono text-gray-400 truncate">{num || '---'}</p>
       </div>
    </div>
  );
}
