'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  UserCircleIcon,
  ShieldExclamationIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  IdentificationIcon
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

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [status, setStatus] = useState<Report['status']>('pending');

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/admin/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setReport(data);
      setStatus(data.status);
      setAdminComment(data.admin_comment || '');
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/admin/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: status,
          admin_comment: adminComment
        }),
      });
      
      if (response.ok) {
        alert('Report updated successfully!');
        router.back();
      }
    } catch (error) {
      console.error('Error updating report:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Fetching Case Details..." />;

  if (!report) return <div className="p-8 text-center text-red-600 font-bold">Report not found.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <main className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="p-2 bg-white shadow-sm border border-gray-200 rounded-full hover:bg-gray-50 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Report Review Case #{report.id}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Report Content */}
            <div className="lg:col-span-12 lg:mb-4">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                          <ExclamationTriangleIcon className="w-8 h-8" />
                       </div>
                       <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Formal Complaint Reason</p>
                          <h2 className="text-2xl font-black text-gray-900 uppercase">{report.reason}</h2>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Submission Time</p>
                       <p className="font-bold text-gray-700">{new Date(report.created_at).toLocaleString('en-IN')}</p>
                    </div>
                 </div>

                 <div className="p-6 bg-red-50/50 border border-red-100 rounded-3xl mb-8">
                    <p className="text-xs text-red-800 font-black uppercase mb-3 tracking-widest">Full Incident Description</p>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium italic">"{report.description}"</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl hover:bg-white hover:shadow-lg transition">
                       <p className="text-xs text-blue-800 font-black uppercase mb-4 tracking-widest">Prosecutor (Reporter)</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">{report.reporter_name[0]}</div>
                          <div>
                             <p className="font-bold text-gray-900">{report.reporter_name}</p>
                             <p className="text-xs text-blue-600 font-black uppercase tracking-tighter">System {report.reporter_role.toUpperCase()} ID: {report.reporter_id}</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-3xl hover:bg-white hover:shadow-lg transition">
                       <p className="text-xs text-orange-800 font-black uppercase mb-4 tracking-widest">Defendant (Reported)</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black">{report.reported_name[0]}</div>
                          <div>
                             <p className="font-bold text-gray-900">{report.reported_name}</p>
                             <p className="text-xs text-orange-600 font-black uppercase tracking-tighter">System {report.reported_role.toUpperCase()} ID: {report.reported_id}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Admin Action Section */}
            <div className="lg:col-span-12">
               <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <ShieldExclamationIcon className="w-48 h-48" />
                  </div>
                  
                  <div className="relative z-10">
                     <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                        <IdentificationIcon className="w-10 h-10 text-blue-500" />
                        Administrative Action Panel
                     </h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <div>
                              <p className="text-xs text-blue-400 font-black uppercase mb-4 tracking-widest">Case Disposition</p>
                              <div className="flex flex-wrap gap-3">
                                 {['pending', 'investigating', 'resolved', 'dismissed'].map(s => (
                                    <button
                                       key={s}
                                       onClick={() => setStatus(s as any)}
                                       className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                                          status === s 
                                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/50 scale-110 z-10' 
                                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                       }`}
                                    >
                                       {s}
                                    </button>
                                 ))}
                              </div>
                           </div>
                           
                           <div>
                              <p className="text-xs text-blue-400 font-black uppercase mb-4 tracking-widest">Internal Review Notes</p>
                              <textarea
                                 className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition min-h-[150px]"
                                 placeholder="Enter findings, decisions or feedback for this case..."
                                 value={adminComment}
                                 onChange={(e) => setAdminComment(e.target.value)}
                              />
                           </div>
                        </div>

                        <div className="flex flex-col justify-end gap-6 pb-2">
                           <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                              <p className="text-xs text-indigo-400 font-black uppercase mb-2 tracking-widest">Finalization Note</p>
                              <p className="text-gray-400 text-xs italic leading-snug">
                                 Your actions here will update the case status for both the reporter and the reported party. Resolved cases are archived for audit.
                              </p>
                           </div>
                           
                           <button 
                              onClick={handleUpdate}
                              disabled={updating}
                              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-xl hover:shadow-blue-500/50 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              {updating ? (
                                 <ClockIcon className="w-5 h-5 animate-spin" />
                              ) : (
                                 <PaperAirplaneIcon className="w-5 h-5" />
                              )}
                              Commit Resolution
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
