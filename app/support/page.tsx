'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { DocumentTextIcon, ExclamationCircleIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Support Ticket interface
interface SupportTicket {
  ticketId: string;
  submittedBy: 'User' | 'ServiceProvider';
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Open' | 'Resolved';
}

// Mock support tickets
const mockTickets: SupportTicket[] = [
  {
    ticketId: 'TICKET001',
    submittedBy: 'User',
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Issue with Booking ID 1',
    message: 'The service provider didn’t show up for my phone repair appointment.',
    date: '2025-05-23 10:00 IST',
    status: 'Open',
  },
  {
    ticketId: 'TICKET002',
    submittedBy: 'ServiceProvider',
    name: 'TechFix Ltd',
    email: 'support@techfix.com',
    subject: 'Payment Not Received',
    message: 'I completed a phone repair for Booking ID 1, but the payment hasn’t been credited.',
    date: '2025-05-22 15:30 IST',
    status: 'Open',
  },
  {
    ticketId: 'TICKET003',
    submittedBy: 'User',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Cancellation Issue',
    message: 'I tried to cancel my laptop upgrade booking, but it’s still showing as pending.',
    date: '2025-05-21 09:00 IST',
    status: 'Resolved',
  },
  {
    ticketId: 'TICKET004',
    submittedBy: 'ServiceProvider',
    name: 'CustomTees Inc',
    email: 'help@customtees.com',
    subject: 'Incorrect Booking Details',
    message: 'The booking details for T-Shirt Customization (Booking ID 3) are incorrect.',
    date: '2025-05-20 14:00 IST',
    status: 'Open',
  },
  {
    ticketId: 'TICKET005',
    submittedBy: 'User',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    subject: 'Refund Delay',
    message: 'I cancelled my phone repair booking on April 15, but I haven’t received my refund yet.',
    date: '2025-05-19 11:00 IST',
    status: 'Resolved',
  },
];

// Calculate totals
const totalTickets = mockTickets.length;
const unresolvedTickets = mockTickets.filter((ticket) => ticket.status === 'Open').length;

// Utility function to truncate message
const truncateMessage = (message: string, maxLength: number) => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Handle status toggle
  const toggleStatus = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticketId === ticketId
          ? { ...ticket, status: ticket.status === 'Open' ? 'Resolved' : 'Open' }
          : ticket
      )
    );
  };

  // Open modal to respond to a ticket
  const openResponseModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setResponseMessage('');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setResponseMessage('');
  };

  // Send response
  const sendResponse = () => {
    if (!responseMessage.trim()) {
      alert('Please enter a response message.');
      return;
    }

    if (selectedTicket) {
      const responseData = {
        ticketId: selectedTicket.ticketId,
        recipientEmail: selectedTicket.email,
        response: responseMessage,
        timestamp: '2025-05-23 19:04 IST', // Current timestamp
      };
      console.log('Sending response:', responseData);
      closeModal();
    }
  };

  // Navigate to ticket details page
  const viewTicketDetails = (ticketId: string) => {
    router.push(`/support/${ticketId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="p-6 sm:p-8"
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Support Tickets
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Total Tickets Card */}
              <motion.div
                className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex items-center"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="p-2 bg-blue-50 rounded-full mr-3">
                  <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600">Total Tickets</h2>
                  <p className="text-xl font-semibold text-gray-800">{totalTickets}</p>
                </div>
              </motion.div>

              {/* Unresolved Tickets Card */}
              <motion.div
                className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex items-center"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="p-2 bg-red-50 rounded-full mr-3">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600">Unresolved Tickets</h2>
                  <p className="text-xl font-semibold text-gray-800">{unresolvedTickets}</p>
                </div>
              </motion.div>
            </div>

            {/* Support Tickets Table */}
            <motion.div
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">
                All Tickets
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket.ticketId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.4, duration: 0.2 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => viewTicketDetails(ticket.ticketId)}
                            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                          >
                            {ticket.ticketId}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {ticket.submittedBy}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {ticket.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {ticket.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {ticket.subject}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {truncateMessage(ticket.message, 30)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {ticket.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              ticket.status === 'Open'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-green-50 text-green-600'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap flex space-x-2">
                          <motion.button
                            onClick={() => toggleStatus(ticket.ticketId)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              ticket.status === 'Open'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            }`}
                          >
                            {ticket.status === 'Open' ? 'Resolve' : 'Reopen'}
                          </motion.button>
                          <motion.button
                            onClick={() => openResponseModal(ticket)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors flex items-center"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            Respond
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Response Modal */}
            {showModal && selectedTicket && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Respond to {selectedTicket.name}
                    </h2>
                    <motion.button
                      onClick={closeModal}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {selectedTicket.subject}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Message:</strong> {truncateMessage(selectedTicket.message, 50)}
                  </p>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write your response here..."
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-300 focus:border-blue-300 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <motion.button
                      onClick={closeModal}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={sendResponse}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Send Response
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}