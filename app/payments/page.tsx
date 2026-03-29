'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  BanknotesIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CreditCardIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  transactionId: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Failed' | 'Pending';
}

interface Withdrawal {
  id: number;
  vendor_id: number;
  amount: number;
  gross_amount: number;
  commission_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  bank_account?: string;
  notes?: string;
  requested_at: string;
}

interface PendingBank {
  id: number;
  vendor_id: number;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name?: string;
  branch_name?: string;
  is_verified: boolean;
  bank_doc_url?: string;
}

interface PaymentStats {
  summary: {
    totalTransactions: number;
    successful_payments: number;
    failed_payments: number;
    pending_payments: number;
    total_revenue: number;
    pending_revenue: number;
  };
  weekly_series: { date: string; amount: number }[];
  monthly_series: { month: string; amount: number }[];
  yearly_series: { year: string; amount: number }[];
  transactions: Transaction[];
}

const colors = {
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(34, 197, 94, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      callbacks: {
        label: (context: TooltipItem<'bar'>) => `Income: ₹${context.raw}`,
      },
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      callbacks: {
        label: (context: TooltipItem<'line'>) => `Income: ₹${context.raw}`,
      },
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function PaymentPage() {
  const [data, setData] = useState<PaymentStats | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [pendingBanks, setPendingBanks] = useState<PendingBank[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals' | 'banks'>('transactions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAllData = async () => {
    try {
      const [statsRes, withRes, bankRes] = await Promise.all([
        apiCall<PaymentStats>('/api/admin/payments/stats'),
        apiCall<Withdrawal[]>('/api/admin/withdrawals/'),
        apiCall<PendingBank[]>('/api/banks/admin/accounts/pending')
      ]);

      if (statsRes) setData(statsRes);
      if (withRes) setWithdrawals(withRes);
      if (bankRes) setPendingBanks(bankRes);
      
    } catch (err) {
      console.error('Error fetching payment data:', err);
      // We don't block the whole page if 1/3 fail, but show a warning
      if (!data) setError('Failed to load primary statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateWithdrawalStatus = async (id: number, status: string) => {
    if (!confirm(`Are you sure you want to update status to ${status}?`)) return;
    setActionLoading(id);
    try {
      await apiCall(`/api/admin/withdrawals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, admin_message: `Status updated to ${status} by Admin` })
      });
      // Refresh withdrawals
      const updated = await apiCall<Withdrawal[]>('/api/admin/withdrawals/');
      setWithdrawals(updated || []);
    } catch (err) {
      alert('Failed to update withdrawal status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyBank = async (id: number, is_verified: boolean) => {
    const action = is_verified ? 'verify' : 'reject';
    if (!confirm(`Are you sure you want to ${action} this bank account?`)) return;
    
    setActionLoading(id);
    try {
      await apiCall(`/api/banks/admin/accounts/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ is_verified, admin_notes: is_verified ? 'Verified by Admin' : 'Rejected by Admin' })
      });
      // Refresh pending banks
      const updated = await apiCall<PendingBank[]>('/api/banks/admin/accounts/pending');
      setPendingBanks(updated || []);
    } catch (err) {
      alert('Failed to verify bank account');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <LoadingSpinner message="Fetching financial records..." />
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
          className="p-6 sm:p-8"
        >
          <div className="max-w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-4xl mb-6">
              Financial Management
            </h2>

            {/* Summary Row */}
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard label="Total Revenue" value={`₹${data.summary.total_revenue.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-8 h-8 text-green-600" />} color="border-green-100" />
                <SummaryCard label="Transactions" value={data.summary.totalTransactions} icon={<DocumentTextIcon className="w-8 h-8 text-blue-600" />} color="border-blue-100" />
                <SummaryCard label="Pending Revenue" value={`₹${data.summary.pending_revenue.toLocaleString()}`} icon={<ClockIcon className="w-8 h-8 text-yellow-600" />} color="border-yellow-100" />
                <SummaryCard label="Withdrawals" value={withdrawals.length} icon={<BanknotesIcon className="w-8 h-8 text-purple-600" />} color="border-purple-100" />
              </div>
            )}

            {/* Charts Row */}
            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard title="Weekly Income">
                  <Bar data={{
                    labels: data.weekly_series.map(s => s.date),
                    datasets: [{ label: 'Income', data: data.weekly_series.map(s => s.amount), backgroundColor: colors.blue }]
                  }} options={barChartOptions} />
                </ChartCard>
                <ChartCard title="Monthly Income">
                  <Line data={{
                    labels: data.monthly_series.map(s => s.month),
                    datasets: [{ 
                      label: 'Income', 
                      data: data.monthly_series.map(s => s.amount), 
                      borderColor: colors.blue, 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                      fill: true,
                      tension: 0.4
                    }]
                  }} options={lineChartOptions} />
                </ChartCard>
              </div>
            )}

            {/* Tabbed Navigation */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                <TabButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
                  Recent Transactions
                </TabButton>
                <TabButton active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')}>
                  Withdrawal Requests ({withdrawals.filter(w => w.status === 'PENDING' || w.status === 'PROCESSING').length})
                </TabButton>
                <TabButton active={activeTab === 'banks'} onClick={() => setActiveTab('banks')}>
                  Bank Verifications ({pendingBanks.length})
                </TabButton>
              </div>

              <div className="p-0 sm:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'transactions' && (
                    <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TransactionTable transactions={data?.transactions || []} />
                    </motion.div>
                  )}
                  {activeTab === 'withdrawals' && (
                    <motion.div key="wd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <WithdrawalTable 
                        withdrawals={withdrawals} 
                        onUpdate={handleUpdateWithdrawalStatus} 
                        actionLoading={actionLoading}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'banks' && (
                    <motion.div key="bk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <BankTable 
                        banks={pendingBanks} 
                        onVerify={handleVerifyBank} 
                        actionLoading={actionLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function SummaryCard({ label, value, icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${color} flex items-center`}>
      <div className="mr-4 bg-gray-50 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, children }: { title: string, children: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-80">
      <h3 className="font-bold text-gray-700 mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean, children: any, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${
        active 
          ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map(tx => (
            <tr key={tx.transactionId} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-blue-600">#{tx.transactionId}</td>
              <td className="px-6 py-4 text-sm font-medium">{tx.customerName}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{tx.serviceName}</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{tx.amount}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  tx.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>{tx.status}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WithdrawalTable({ withdrawals, onUpdate, actionLoading }: { 
  withdrawals: Withdrawal[], 
  onUpdate: (id: number, status: string) => void,
  actionLoading: number | null
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Vendor ID</th>
            <th className="px-6 py-4">Amount (Net)</th>
            <th className="px-6 py-4">Gross/Comm</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {withdrawals.map(w => (
            <tr key={w.id} className="hover:bg-purple-50/30 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-purple-600">#{w.id}</td>
              <td className="px-6 py-4 text-sm font-medium">VND-{w.vendor_id}</td>
              <td className="px-6 py-4 text-sm font-bold text-green-600 text-lg">₹{w.amount}</td>
              <td className="px-6 py-4 text-xs text-gray-500">
                <div className="flex flex-col">
                   <span>G: ₹{w.gross_amount}</span>
                   <span className="text-red-400">C: ₹{w.commission_amount}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  w.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  w.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{w.status}</span>
              </td>
              <td className="px-6 py-4">
                 <div className="flex flex-wrap gap-2">
                    {w.status === 'PENDING' && (
                      <button 
                        disabled={actionLoading === w.id}
                        onClick={() => onUpdate(w.id, 'PROCESSING')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50"
                      >
                        Start Processing
                      </button>
                    )}
                    {w.status === 'PROCESSING' && (
                      <button 
                        disabled={actionLoading === w.id}
                        onClick={() => onUpdate(w.id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    )}
                    {(w.status === 'PENDING' || w.status === 'PROCESSING') && (
                      <button 
                        disabled={actionLoading === w.id}
                        onClick={() => onUpdate(w.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                 </div>
              </td>
            </tr>
          ))}
          {withdrawals.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No withdrawal requests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BankTable({ banks, onVerify, actionLoading }: { 
  banks: PendingBank[], 
  onVerify: (id: number, verify: boolean) => void,
  actionLoading: number | null
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4">Account Holder</th>
            <th className="px-6 py-4">A/C Number</th>
            <th className="px-6 py-4">Bank/IFSC</th>
            <th className="px-6 py-4">Docs</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {banks.map(bk => (
            <tr key={bk.id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-gray-800">{bk.account_holder_name}</p>
                <p className="text-[10px] text-gray-500 uppercase">VND-{bk.vendor_id}</p>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-600">{bk.account_number}</td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-700">{bk.bank_name || 'N/A'}</p>
                <p className="text-xs text-gray-400 font-mono tracking-tighter">{bk.ifsc_code}</p>
              </td>
              <td className="px-6 py-4">
                 {bk.bank_doc_url ? (
                   <a 
                     href={bk.bank_doc_url} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline"
                   >
                     <EyeIcon className="w-3 h-3" />
                     VIEW PROOF
                   </a>
                 ) : <span className="text-[10px] text-gray-400 italic">No Docs</span>}
              </td>
              <td className="px-6 py-4">
                 <div className="flex gap-2">
                    <button 
                      disabled={actionLoading === bk.id}
                      onClick={() => onVerify(bk.id, true)}
                      className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition disabled:opacity-50"
                      title="Verify"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button 
                      disabled={actionLoading === bk.id}
                      onClick={() => onVerify(bk.id, false)}
                      className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                 </div>
              </td>
            </tr>
          ))}
          {banks.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No pending bank verifications.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
