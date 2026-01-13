'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth'; 
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
  TooltipItem, // Import TooltipItem for typing
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

// Process data for charts
// Weekly Bookings (May 19 - May 25, 2025)
const weeklyLabels = ['May 19', 'May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25'];
const weeklyData = weeklyLabels.map((day) => {
  return mockBookings.filter((booking) => booking.date.includes(day)).length;
});

// Monthly Bookings (2025)
const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthlyData = monthlyLabels.map((month, index) => {
  return mockBookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getMonth() === index && bookingDate.getFullYear() === 2025;
  }).length;
});

// Yearly Bookings (2023-2025)
const yearlyLabels = ['2023', '2024', '2025'];
const yearlyData = yearlyLabels.map((year) => {
  return mockBookings.filter((booking) => booking.date.includes(year)).length;
});

// Category-wise Bookings
const categoryLabels = ['Electronics', 'Clothing', 'Books'];
const categoryData = categoryLabels.map((category) => {
  return mockBookings.filter((booking) => booking.categoryName === category).length;
});
const totalBookings = categoryData.reduce((sum, count) => sum + count, 0);

// Subcategory-wise Bookings
const subcategoryLabels = ['Smartphones', 'Laptops', 'T-Shirts', 'Jeans', 'Fiction'];
const subcategoryData = subcategoryLabels.map((subcategory) => {
  return mockBookings.filter((booking) => booking.subcategoryName === subcategory).length;
});

// Service-wise Bookings
const serviceLabels = ['Phone Repair', 'Laptop Upgrade', 'T-Shirt Customization', 'Jeans Alteration', 'Book Binding'];
const serviceData = serviceLabels.map((service) => {
  return mockBookings.filter((booking) => booking.serviceName === service).length;
});

// Color palette for charts
const colors = {
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(34, 197, 94, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
  pink: 'rgba(236, 72, 153, 0.8)',
  purple: 'rgba(139, 92, 246, 0.8)',
};

// Bar chart options (Weekly, Yearly, Service-wise)
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
          const value = context.raw as number;
          const percentage = ((value / totalBookings) * 100).toFixed(1);
          return `${context.label}: ${value} bookings (${percentage}%)`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Bookings',
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

// Line chart options (Monthly)
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
          const value = context.raw as number;
          const percentage = ((value / totalBookings) * 100).toFixed(1);
          return `${context.label}: ${value} bookings (${percentage}%)`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Bookings',
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

// Doughnut chart options (Category-wise)
const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: { size: 14 },
        color: '#374151',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      padding: 10,
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const value = context.raw as number;
          const percentage = ((value / totalBookings) * 100).toFixed(1);
          return `${context.label}: ${value} bookings (${percentage}%)`;
        },
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad' as const,
  },
};

// PolarArea chart options (Subcategory-wise)
const polarAreaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: { size: 14 },
        color: '#374151',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      padding: 10,
      callbacks: {
        label: (context: TooltipItem<'polarArea'>) => {
          const value = context.raw as number;
          const percentage = ((value / totalBookings) * 100).toFixed(1);
          return `${context.label}: ${value} bookings (${percentage}%)`;
        },
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#374151',
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad' as const,
  },
};

// Bar chart options for Service-wise (with rotated labels)
const serviceBarChartOptions = {
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
          const value = context.raw as number;
          const percentage = ((value / totalBookings) * 100).toFixed(1);
          return `${context.label}: ${value} bookings (${percentage}%)`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Bookings',
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
        text: 'Service',
        font: { size: 14 },
        color: '#374151',
      },
      ticks: {
        color: '#374151',
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad' as const,
  },
};

export default function DashboardPage() {
  const recentBookings = mockBookings.slice(0, 5);
  const router = useRouter();

 
  useEffect(() => {
  const token = getToken();
  if (!token) {
    router.replace('/login');
  }
}, [router]); // add router to dependency array


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
              Dashboard
            </h1>

            {/* Recent Bookings */}
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 mb-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
                Recent Bookings
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
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
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.serviceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Weekly Bookings (Bar Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Weekly Bookings (May 19-25, 2025)
                </h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: weeklyLabels,
                      datasets: [
                        {
                          label: 'Bookings',
                          data: weeklyData,
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

              {/* Monthly Bookings (Line Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Monthly Bookings (2025)
                </h2>
                <div className="h-64">
                  <Line
                    data={{
                      labels: monthlyLabels,
                      datasets: [
                        {
                          label: 'Bookings',
                          data: monthlyData,
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

              {/* Yearly Bookings (Bar Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Yearly Bookings
                </h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: yearlyLabels,
                      datasets: [
                        {
                          label: 'Bookings',
                          data: yearlyData,
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

              {/* Category-wise Bookings (Doughnut Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Category-wise Bookings
                </h2>
                <div className="h-64">
                  <Doughnut
                    data={{
                      labels: categoryLabels,
                      datasets: [
                        {
                          data: categoryData,
                          backgroundColor: [
                            colors.blue,
                            colors.green,
                            colors.purple,
                          ],
                          borderColor: [
                            colors.blue.replace('0.8', '1'),
                            colors.green.replace('0.8', '1'),
                            colors.purple.replace('0.8', '1'),
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={doughnutChartOptions}
                  />
                </div>
              </motion.div>

              {/* Subcategory-wise Bookings (Polar Area Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Subcategory-wise Bookings
                </h2>
                <div className="h-64">
                  <PolarArea
                    data={{
                      labels: subcategoryLabels,
                      datasets: [
                        {
                          data: subcategoryData,
                          backgroundColor: [
                            colors.blue,
                            colors.green,
                            colors.orange,
                            colors.pink,
                            colors.purple,
                          ],
                          borderColor: [
                            colors.blue.replace('0.8', '1'),
                            colors.green.replace('0.8', '1'),
                            colors.orange.replace('0.8', '1'),
                            colors.pink.replace('0.8', '1'),
                            colors.purple.replace('0.8', '1'),
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={polarAreaChartOptions}
                  />
                </div>
              </motion.div>

              {/* Service-wise Bookings (Bar Chart) */}
              <motion.div
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-100 p-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Service-wise Bookings
                </h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: serviceLabels,
                      datasets: [
                        {
                          label: 'Bookings',
                          data: serviceData,
                          backgroundColor: [
                            colors.blue,
                            colors.green,
                            colors.orange,
                            colors.pink,
                            colors.purple,
                          ],
                          borderColor: [
                            colors.blue.replace('0.8', '1'),
                            colors.green.replace('0.8', '1'),
                            colors.orange.replace('0.8', '1'),
                            colors.pink.replace('0.8', '1'),
                            colors.purple.replace('0.8', '1'),
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={serviceBarChartOptions}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}