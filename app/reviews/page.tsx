'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ChatBubbleLeftRightIcon, 
  ShieldCheckIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  UserCircleIcon,
  TicketIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface Review {
  id: number;
  booking_id: number;
  user_id: number;
  user_name: string;
  service_provider_id: number;
  service_provider_name: string;
  rating: number;
  review_text: string;
  is_anonymous: boolean;
  admin_approved: boolean;
  created_at: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unapproved' | 'approved'>('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    const endpoint = '/api/reviews/admin/all';
    let url = `${API_BASE_URL}${endpoint}`;
    
    // Safety check for API_BASE_URL
    if (!API_BASE_URL || API_BASE_URL.includes('undefined')) {
      console.error('CRITICAL: API_BASE_URL is not properly configured. Current value:', API_BASE_URL);
    }
    
    if (filter !== 'all') {
      const glue = url.includes('?') ? '&' : '?';
      url += `${glue}approved=${filter === 'approved'}`;
    }
    
    try {
      console.log('Fetching system feedback from:', url);
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
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to communicate with feedback authority:', error);
      console.error('Attempted URL:', url);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/admin/${id}/approve?approved=${approve}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, admin_approved: approve } : r));
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review Permanently?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pb-12">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Review Moderation</h1>
              <p className="text-gray-500 font-medium">Platform feedback & public ratings</p>
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
               {['all', 'unapproved', 'approved'].map(type => (
                 <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                       filter === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                 >
                    {type}
                 </button>
               ))}
            </div>
          </div>

          {loading ? (
             <div className="h-96 flex items-center justify-center">
                <LoadingSpinner message="Scanning Ratings Database..." />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {reviews.map((review, index) => (
                 <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col relative group overflow-hidden h-fit flex-grow"
                 >
                    {/* Background Texture Placeholder */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition duration-500">
                       <ChatBubbleLeftRightIcon className="w-24 h-24" />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                             <StarIconSolid 
                                key={star} 
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                             />
                          ))}
                       </div>
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                          review.admin_approved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                       }`}>
                          {review.admin_approved ? 'Published' : 'Flagged'}
                       </span>
                    </div>

                    <p className="text-gray-800 font-bold italic text-base leading-relaxed mb-8 flex-grow">
                      "{review.review_text || 'No commentary provided.'}"
                    </p>

                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><UserCircleIcon className="w-5 h-5"/></div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Author</p>
                             <p className="text-sm font-black text-gray-900 truncate">
                                {review.is_anonymous ? 'Incognito (Anonymous)' : review.user_name}
                             </p>
                          </div>
                          <div 
                             onClick={() => router.push(`/users/${review.user_id}`)}
                             className="p-1 text-gray-300 hover:text-indigo-600 cursor-pointer transition"
                          >
                             <CheckIcon className="w-4 h-4" />
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><BriefcaseIcon className="w-5 h-5"/></div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Provider Point</p>
                             <p className="text-sm font-black text-gray-900 truncate">{review.service_provider_name}</p>
                          </div>
                          <div 
                             onClick={() => router.push(`/providers/${review.service_provider_id}`)}
                             className="p-1 text-gray-300 hover:text-orange-600 cursor-pointer transition"
                          >
                             <CheckIcon className="w-4 h-4" />
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TicketIcon className="w-5 h-5"/></div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ticket Reference</p>
                             <p className="text-sm font-black text-gray-900 truncate">#ORD-{review.booking_id}</p>
                          </div>
                          <div 
                             onClick={() => router.push(`/bookings/details/${review.booking_id}`)}
                             className="p-1 text-gray-300 hover:text-emerald-600 cursor-pointer transition"
                          >
                             <CheckIcon className="w-4 h-4" />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50 mt-auto">
                       <button 
                          onClick={() => handleApprove(review.id, !review.admin_approved)}
                          className={`py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition shadow-lg ${
                             review.admin_approved 
                             ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-100' 
                             : 'bg-green-50 text-green-700 hover:bg-green-100 shadow-green-100'
                          }`}
                       >
                          {review.admin_approved ? <XMarkIcon className="w-4 h-4"/> : <CheckIcon className="w-4 h-4"/>}
                          {review.admin_approved ? 'Suppress' : 'Approve'}
                       </button>
                       <button 
                          onClick={() => handleDelete(review.id)}
                          className="py-3 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition shadow-lg shadow-gray-200"
                       >
                          <TrashIcon className="w-4 h-4" />
                          Erase
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}
          
          {!loading && reviews.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
               <div className="text-4xl mb-4 opacity-20">🌠</div>
               <p className="text-gray-400 font-bold italic">No feedback entries found in the selection.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
