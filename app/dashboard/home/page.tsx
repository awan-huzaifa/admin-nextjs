'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/dashboard';
import StatCard from '@/components/dashboard/StatCard';
import { 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import DashboardLayout from '@/components/DashboardLayout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Chart.js data configuration
  const registrationChartData = {
    labels: stats.registrationTrend.map((item: any) => item.date),
    datasets: [
      {
        label: 'New Registrations',
        data: stats.registrationTrend.map((item: any) => item.count),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const areaChartData = {
    labels: stats.vendorsByArea.map((item: any) => `${item.serviceArea}km`),
    datasets: [
      {
        label: 'Vendors by Service Area',
        data: stats.vendorsByArea.map((item: any) => item.count),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon={<UserGroupIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Pending Verification"
          value={stats.pendingVendors}
          icon={<ClockIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Approved Vendors"
          value={stats.approvedVendors}
          icon={<CheckCircleIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Verification Rate"
          value={`${stats.verificationRate}%`}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          trend={{
            value: 12,
            isPositive: true
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registration Trend</h2>
          <div className="h-80">
            <Line 
              data={registrationChartData} 
              options={chartOptions}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Vendors by Service Area</h2>
          <div className="h-80">
            <Bar 
              data={areaChartData} 
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* Recent Vendors Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Vendors</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentVendors.map((vendor: any) => (
                <tr key={vendor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vendor.User.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.User.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vendor.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      vendor.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}