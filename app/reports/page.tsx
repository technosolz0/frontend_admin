'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ExclamationTriangleIcon, 
  ShieldExclamationIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  UserGroupIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Report {
  id: number;
  reporter_id: number;
  reporter_role: 'user' | 'vendor';
  reporter_name: string;
  reported_id: number;
  reported_role: 'user' | 'vendor';
  reported_name: string;
  booking_id?: number;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  admin_comment?: string;
  created_at: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    const endpoint = '/api/reports/admin/all';
    let url = `${API_BASE_URL}${endpoint}`;
    
    if (filter !== 'all') {
      const glue = url.includes('?') ? '&' : '?';
      url += `${glue}status=${filter}`;
    }
    
    try {
      console.log('Fetching system reports from:', url);
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      
      const data = await response.json();
      setReports(data || []);
    } catch (error) {
      console.error('Failed to communicate with legal authority:', error);
      console.error('Attempted URL:', url);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    investigating: 'bg-blue-100 text-blue-700 border-blue-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
    dismissed: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const filteredReports = reports.filter(r => 
    r.reporter_name.toLowerCase().includes(search.toLowerCase()) ||
    r.reported_name.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Compliance & Reports</h1>
              <p className="text-gray-500 font-medium">Manage user and vendor complaints</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
               <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 All
               </button>
               <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'pending' ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 Pending
               </button>
               <button 
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'resolved' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 Resolved
               </button>
            </div>
          </div>

          <div className="relative mb-8">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
             </div>
             <input
                type="text"
                placeholder="Search by names, reason or description..."
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
               <LoadingSpinner message="Scanning Reports..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
               {filteredReports.map((report, index) => (
                 <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 hover:border-blue-200 transition group"
                 >
                    <div className="flex flex-col lg:flex-row gap-6">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                             <div className={`p-2 rounded-xl ${report.status === 'pending' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                                <ExclamationTriangleIcon className="w-6 h-6" />
                             </div>
                             <div>
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{report.reason}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
                                   <ClockIcon className="w-3.5 h-3.5" />
                                   {new Date(report.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                                </div>
                             </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                            "{report.description}"
                          </p>

                          <div className="flex flex-wrap gap-4">
                             <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-bold text-gray-700">Reporter: {report.reporter_name} ({report.reporter_role})</span>
                             </div>
                             <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                <UserGroupIcon className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-bold text-gray-700">Reported: {report.reported_name} ({report.reported_role})</span>
                             </div>
                             {report.booking_id && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition"
                                     onClick={() => router.push(`/bookings/details/${report.booking_id}`)}>
                                   <ShieldExclamationIcon className="w-4 h-4 text-indigo-600" />
                                   <span className="text-xs font-bold text-indigo-700">Ref Booking #{report.booking_id}</span>
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="flex flex-row lg:flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 min-w-[150px]">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[report.status]}`}>
                            {report.status}
                          </span>
                          
                          <button 
                             onClick={() => router.push(`/reports/${report.id}`)}
                             className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition shadow-lg shadow-gray-200"
                          >
                             Review Action
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}

               {filteredReports.length === 0 && (
                 <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                    No reports match your current selection.
                 </div>
               )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
