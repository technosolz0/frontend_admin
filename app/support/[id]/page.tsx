'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

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

// Response interface
interface Response {
  sender: string;
  message: string;
  timestamp: string;
}

// Mock support tickets (same as SupportPage.tsx)
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

// Mock responses (simulated history)
const mockResponses: { [key: string]: Response[] } = {
  TICKET001: [
    {
      sender: 'Admin',
      message: 'We’re looking into this issue. Can you confirm the booking time?',
      timestamp: '2025-05-23 12:00 IST',
    },
  ],
  TICKET003: [
    {
      sender: 'Admin',
      message: 'The cancellation has been processed. You should see the update now.',
      timestamp: '2025-05-21 10:00 IST',
    },
  ],
  // Other tickets have no responses yet
};

export default function SupportTicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.ticketId as string;

  const ticket = mockTickets.find((t) => t.ticketId === ticketId);
  const [responses, setResponses] = useState<Response[]>(
    mockResponses[ticketId] || []
  );
  const [newResponse, setNewResponse] = useState('');

  if (!ticket) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
              Ticket Not Found
            </h1>
            <button
              onClick={() => router.push('/support')}
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Support Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSendResponse = () => {
    if (!newResponse.trim()) {
      alert('Please enter a response message.');
      return;
    }

    const response: Response = {
      sender: 'Admin',
      message: newResponse,
      timestamp: '2025-05-23 18:44 IST', // Current timestamp
    };

    setResponses([...responses, response]);
    console.log('Sending response:', {
      ticketId: ticket.ticketId,
      recipientEmail: ticket.email,
      response: newResponse,
      timestamp: response.timestamp,
    });

    setNewResponse('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8"
        >
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push('/support')}
              className="flex items-center text-blue-600 hover:underline mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Support Tickets
            </button>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
              Ticket Details: {ticket.ticketId}
            </h1>

            {/* Ticket Details Card */}
            <motion.div
              className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 mb-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ticket Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Submitted By:</strong> {ticket.submittedBy}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {ticket.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {ticket.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Subject:</strong> {ticket.subject}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {ticket.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === 'Open'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Message:</strong> {ticket.message}
              </p>
            </motion.div>

            {/* Response History */}
            <motion.div
              className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 mb-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Response History
              </h2>
              {responses.length === 0 ? (
                <p className="text-sm text-gray-600">No responses yet.</p>
              ) : (
                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-800">
                          {response.sender}
                        </p>
                        <p className="text-xs text-gray-500">
                          {response.timestamp}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Send Response */}
            <motion.div
              className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Send a Response
              </h2>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Write your response here..."
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <button
                onClick={handleSendResponse}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Send Response
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}