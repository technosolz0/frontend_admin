'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircleIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import {
  FeedbackDTO,
  getFeedbackList,
  updateFeedbackStatus,
  deleteFeedback,
  respondToFeedback,
} from '@/services/feedbackService';

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const itemsPerPage = 10;

  // Modals
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDTO | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      let resolvedFilter: boolean | undefined = undefined;
      if (filter === 'resolved') resolvedFilter = true;
      if (filter === 'unresolved') resolvedFilter = false;

      const data = await getFeedbackList(skip, itemsPerPage, resolvedFilter);
      setFeedbackList(data.feedback);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, filter]);

  const handleResolve = async (id: number, currentStatus: boolean) => {
    if (confirm(`Mark this feedback as ${currentStatus ? 'unresolved' : 'resolved'}?`)) {
      try {
        await updateFeedbackStatus(id, !currentStatus);
        fetchFeedback(); // Refresh list
      } catch (err: unknown) {
        alert('Failed to update status');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(id);
        fetchFeedback();
      } catch (err: unknown) {
        alert('Failed to delete feedback');
      }
    }
  };

  const openResponseModal = (feedback: FeedbackDTO) => {
    setSelectedFeedback(feedback);
    setResponseMessage(feedback.admin_response || '');
    setShowResponseModal(true);
  };

  const handleSendResponse = async () => {
    if (!selectedFeedback || !responseMessage) return;
    setIsResponding(true);
    try {
      await respondToFeedback(selectedFeedback.id, responseMessage);
      setShowResponseModal(false);
      fetchFeedback();
    } catch (err: unknown) {
      alert('Failed to send response');
    } finally {
      setIsResponding(false);
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
          className="p-6 sm:p-8"
        >
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:text-4xl">User Feedback</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mb-6">
              {(['all', 'resolved', 'unresolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">{error}</div>}

            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-blue-100"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                  ) : feedbackList.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No feedback found.</td></tr>
                  ) : (
                    feedbackList.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{item.user_name}</div>
                          <div className="text-gray-500 text-xs">{item.user_email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-semibold text-gray-900">{item.subject}</div>
                          <div className="truncate max-w-xs text-gray-500">{item.message}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {item.is_resolved ? 'Resolved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex space-x-2">
                          {/* Respond / View Details */}
                          <button
                            onClick={() => openResponseModal(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View & Respond"
                          >
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                          </button>

                          {/* Filter/Resolve */}
                          <button
                            onClick={() => handleResolve(item.id, item.is_resolved)}
                            className={`hover:text-green-800 ${item.is_resolved ? 'text-gray-400' : 'text-green-600'}`}
                            title={item.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white rounded border disabled:opacity-50">Prev</button>
                <span className="self-center">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white rounded border disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* View/Response Modal */}
        <AnimatePresence>
          {showResponseModal && selectedFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4">Feedback Details</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">From: {selectedFeedback.user_name} ({selectedFeedback.user_email})</p>
                  <p className="text-sm text-gray-500">Subject: {selectedFeedback.subject}</p>
                  {selectedFeedback.category && <p className="text-sm text-gray-500">Category: {selectedFeedback.category}</p>}
                  <div className="mt-2 text-gray-800 bg-gray-50 p-3 rounded">
                    {selectedFeedback.message}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={4}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response here..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSendResponse}
                    disabled={isResponding || !responseMessage}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isResponding ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
