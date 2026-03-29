'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api'; 
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  Filler,
  PointElement,
  RadialLinearScale,
  TooltipItem, 
} from 'chart.js';
import { Bar, Line, Doughnut, PolarArea } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  Filler,
  PointElement,
  RadialLinearScale
);

interface Booking {
  id: string | number;
  customerName: string;
  serviceName: string;
  serviceProviderName: string;
  date: string;
  status: string;
}

interface DashboardData {
  summary: {
    total_users: number;
    total_vendors: number;
    total_bookings: number;
  };
  weekly_series: { date: string; count: number }[];
  monthly_series: { month: string; count: number }[];
  yearly_series: { year: string; count: number }[];
  recent_bookings: Booking[];
  category_wise: { name: string; count: number }[];
  subcategory_wise: { name: string; count: number }[];
}

// Color palette for charts
const colors = {
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(34, 197, 94, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
  pink: 'rgba(236, 72, 153, 0.8)',
  purple: 'rgba(139, 92, 246, 0.8)',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await apiCall<DashboardData>('/api/admin/dashboard/');
        if (stats) {
          setData(stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Error loading dashboard. Please try again later.</div>;
  }

  const totalBookings = data.summary.total_bookings;

  // Bar chart options
  const getBarChartOptions = (xAxisTitle: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: (context: TooltipItem<any>) => {
            const value = context.raw as number;
            const percentage = totalBookings > 0 ? ((value / totalBookings) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: xAxisTitle } },
    },
  });

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
            <h2 className="text-2xl font-bold text-gray-800 sm:text-4xl mb-6">
              Dashboard Overview
            </h2>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Users', value: data.summary.total_users, color: 'bg-white bg-opacity-90 shadow-xl rounded-2xl border border-gray-100 mb-8', icon: '👥' },
                { label: 'Total Vendors', value: data.summary.total_vendors, color: 'bg-white bg-opacity-90 shadow-xl rounded-2xl border border-gray-100 mb-8', icon: '🏪' },
                { label: 'Total Bookings', value: data.summary.total_bookings, color: 'bg-white bg-opacity-90 shadow-xl rounded-2xl border border-gray-100 mb-8', icon: '📅' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.color} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between`}
                >
                  <div>
                    <p className="text-sm opacity-80 uppercase tracking-wider font-bold text-gray-800">{stat.label}</p>
                    <h3 className="text-3xl font-extrabold mt-1 text-gray-800">{stat.value}</h3>
                  </div>
                  <div className="text-4xl opacity-50 text-gray-800">{stat.icon}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings Table */}
            <motion.div
              className="bg-white bg-opacity-90 shadow-xl rounded-2xl border border-gray-100 mb-8"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 italic">
                    {data.recent_bookings.map((booking, index) => (
                      <tr key={booking.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">#{booking.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{booking.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{booking.serviceName}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{booking.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                             ['Confirmed', 'accepted', 'completed'].includes(booking.status.toLowerCase()) ? 'bg-green-100 text-green-700' : 
                             ['Pending'].includes(booking.status.toLowerCase()) ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Weekly Performance Bar Chart */}
              <div className="bg-white p-10 rounded-2xl shadow-lg h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Weekly Performance</h3>
                <Bar 
                  data={{
                    labels: data.weekly_series.map(d => d.date),
                    datasets: [{
                      label: 'Bookings',
                      data: data.weekly_series.map(d => d.count),
                      backgroundColor: colors.blue,
                      borderRadius: 8,
                    }]
                  }}
                  options={getBarChartOptions('Last 7 Days')}
                />
              </div>

              {/* Monthly Growth Line Chart */}
              <div className="bg-white p-10 rounded-2xl shadow-lg h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Monthly Growth</h3>
                <Line 
                   data={{
                    labels: data.monthly_series.map(d => d.month),
                    datasets: [{
                      label: 'Monthly Growth',
                      data: data.monthly_series.map(d => d.count),
                      borderColor: colors.purple,
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 6,
                    }]
                  }}
                  options={getBarChartOptions('Last 12 Months')}
                />
              </div>

              {/* Category-wise Doughnut */}
              <div className="bg-white p-10 rounded-2xl shadow-lg h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Category Distribution</h3>
                <Doughnut 
                  data={{
                    labels: data.category_wise.map(d => d.name),
                    datasets: [{
                      data: data.category_wise.map(d => d.count),
                      backgroundColor: [colors.blue, colors.green, colors.orange, colors.pink, colors.purple],
                      borderWidth: 0,
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>

               {/* Yearly Comparison Bar Chart */}
               <div className="bg-white p-10 rounded-2xl shadow-lg h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Yearly Comparison</h3>
                <Bar 
                  data={{
                    labels: data.yearly_series.map(d => d.year),
                    datasets: [{
                      label: 'Yearly Volume',
                      data: data.yearly_series.map(d => d.count),
                      backgroundColor: colors.orange,
                      borderRadius: 8,
                    }]
                  }}
                  options={getBarChartOptions('Recent Years')}
                />
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}