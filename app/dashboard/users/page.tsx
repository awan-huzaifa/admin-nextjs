'use client';

import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';

// Dynamically import ServicesManagement with no SSR
const UsersManagement = dynamic(
  () => import('@/components/UsersManagement'),
  { ssr: false }
);

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Users Management</h1>
      <UsersManagement />
    </DashboardLayout>
  );
}
