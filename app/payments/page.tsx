'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Added to fix the error
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
  PointElement, // Added to fix the error
  Filler,
  Title,
  Tooltip,
  Legend
);

// Define interfaces for Booking and Transaction
interface Booking {
  id: string;
  customerName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  serviceId: string;
  serviceName: string;
  serviceProviderId: string;
  serviceProviderName: string;
  date: string;
  status: string;
}

interface Transaction {
  transactionId: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Failed' | 'Pending';
}

// Mock booking data (same as DashboardPage.tsx)
const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Doe',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '1',
    subcategoryName: 'Smartphones',
    serviceId: '1',
    serviceName: 'Phone Repair',
    serviceProviderId: '1',
    serviceProviderName: 'TechFix Ltd',
    date: '2025-05-23 15:30 IST',
    status: 'Confirmed',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '2',
    subcategoryName: 'Laptops',
    serviceId: '2',
    serviceName: 'Laptop Upgrade',
    serviceProviderId: '2',
    serviceProviderName: 'LapCare Solutions',
    date: '2025-05-22 10:00 IST',
    status: 'Pending',
  },
  {
    id: '3',
    customerName: 'Alice Brown',
    categoryId: '2',
    categoryName: 'Clothing',
    subcategoryId: '3',
    subcategoryName: 'T-Shirts',
    serviceId: '3',
    serviceName: 'T-Shirt Customization',
    serviceProviderId: '3',
    serviceProviderName: 'CustomTees Inc',
    date: '2025-05-21 14:00 IST',
    status: 'Cancelled',
  },
  {
    id: '4',
    customerName: 'Bob Johnson',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '1',
    subcategoryName: 'Smartphones',
    serviceId: '1',
    serviceName: 'Phone Repair',
    serviceProviderId: '1',
    serviceProviderName: 'TechFix Ltd',
    date: '2025-04-15 09:00 IST',
    status: 'Confirmed',
  },
  {
    id: '5',
    customerName: 'Emma Wilson',
    categoryId: '2',
    categoryName: 'Clothing',
    subcategoryId: '4',
    subcategoryName: 'Jeans',
    serviceId: '4',
    serviceName: 'Jeans Alteration',
    serviceProviderId: '4',
    serviceProviderName: 'StitchFix Co',
    date: '2025-03-10 11:00 IST',
    status: 'Confirmed',
  },
  {
    id: '6',
    customerName: 'Mike Lee',
    categoryId: '3',
    categoryName: 'Books',
    subcategoryId: '5',
    subcategoryName: 'Fiction',
    serviceId: '5',
    serviceName: 'Book Binding',
    serviceProviderId: '5',
    serviceProviderName: 'BookCare Inc',
    date: '2024-12-05 13:00 IST',
    status: 'Confirmed',
  },
  {
    id: '7',
    customerName: 'Sarah Davis',
    categoryId: '1',
    categoryName: 'Electronics',
    subcategoryId: '2',
    subcategoryName: 'Laptops',
    serviceId: '2',
    serviceName: 'Laptop Upgrade',
    serviceProviderId: '2',
    serviceProviderName: 'LapCare Solutions',
    date: '2024-06-20 16:00 IST',
    status: 'Pending',
  },
  {
    id: '8',
    customerName: 'Tom Harris',
    categoryId: '2',
    categoryName: 'Clothing',
    subcategoryId: '3',
    subcategoryName: 'T-Shirts',
    serviceId: '3',
    serviceName: 'T-Shirt Customization',
    serviceProviderId: '3',
    serviceProviderName: 'CustomTees Inc',
    date: '2023-11-15 12:00 IST',
    status: 'Confirmed',
  },
];

// Mock transaction data derived from bookings
const mockTransactions: Transaction[] = mockBookings.map((booking, index) => {
  const transactionStatus =
    booking.status === 'Confirmed' ? 'Completed' :
    booking.status === 'Pending' ? 'Pending' :
    'Failed';

  // Mock amounts for each service (in dollars)
  const serviceAmounts: { [key: string]: number } = {
    'Phone Repair': 50,
    'Laptop Upgrade': 100,
    'T-Shirt Customization': 20,
    'Jeans Alteration': 15,
    'Book Binding': 30,
  };

  return {
    transactionId: `TXN${index + 1}`,
    bookingId: booking.id,
    customerName: booking.customerName,
    serviceName: booking.serviceName,
    amount: serviceAmounts[booking.serviceName] || 0,
    date: booking.date,
    status: transactionStatus,
  };
});

// Calculate totals
const totalTransactions = mockTransactions.length;
const totalRevenue = mockTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

// Process data for charts
// Weekly Income (May 19 - May 25, 2025)
const weeklyLabels = ['May 19', 'May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25'];
const weeklyIncome = weeklyLabels.map((day) => {
  return mockTransactions
    .filter((transaction) => transaction.date.includes(day))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

// Monthly Income (2025)
const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthlyIncome = monthlyLabels.map((month, index) => {
  return mockTransactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === index && transactionDate.getFullYear() === 2025;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

// Yearly Income (2023-2025)
const yearlyLabels = ['2023', '2024', '2025'];
const yearlyIncome = yearlyLabels.map((year) => {
  return mockTransactions
    .filter((transaction) => transaction.date.includes(year))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

// Color palette for charts (consistent with DashboardPage.tsx)
const colors = {
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(34, 197, 94, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
};

// Chart options (consistent with DashboardPage.tsx)
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      padding: 10,
      callbacks: {
       label: (context: TooltipItem<'bar'>) => {
          const value = context?.raw ?? 0;
          return `Income: $${value}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Income ($)',
        font: { size: 14 },
        color: '#374151',
      },
      ticks: {
        color: '#374151',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Date',
        font: { size: 14 },
        color: '#374151',
      },
      ticks: {
        color: '#374151',
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad' as const,
  },
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      padding: 10,
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          const value = context?.raw ?? 0;
          return `Income: $${value}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Income ($)',
        font: { size: 14 },
        color: '#374151',
      },
      ticks: {
        color: '#374151',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Month',
        font: { size: 14 },
        color: '#374151',
      },
      ticks: {
        color: '#374151',
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad' as const,
  },
};

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8"
        >
          <div className="max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-6">
              Admin Panel - Transactions
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="w-10 h-10 text-blue-600 mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Total Transactions
                    </h2>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalTransactions}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-10 h-10 text-green-600 mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Total Revenue
                    </h2>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalRevenue}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Income Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Weekly Income (Bar Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Weekly Income (May 19-25, 2025)
                </h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: weeklyLabels,
                      datasets: [
                        {
                          label: 'Income',
                          data: weeklyIncome,
                          backgroundColor: colors.blue,
                          borderColor: colors.blue.replace('0.8', '1'),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                </div>
              </motion.div>

              {/* Monthly Income (Line Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Monthly Income (2025)
                </h2>
                <div className="h-64">
                  <Line
                    data={{
                      labels: monthlyLabels,
                      datasets: [
                        {
                          label: 'Income',
                          data: monthlyIncome,
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          borderColor: colors.blue,
                          borderWidth: 2,
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                </div>
              </motion.div>

              {/* Yearly Income (Bar Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Yearly Income
                </h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: yearlyLabels,
                      datasets: [
                        {
                          label: 'Income',
                          data: yearlyIncome,
                          backgroundColor: colors.orange,
                          borderColor: colors.orange.replace('0.8', '1'),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      ...barChartOptions,
                      scales: {
                        ...barChartOptions.scales,
                        x: {
                          ...barChartOptions.scales.x,
                          title: {
                            display: true,
                            text: 'Year',
                            font: { size: 14 },
                            color: '#374151',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 mb-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
                All Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Booking ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Customer Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.transactionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.bookingId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.serviceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}