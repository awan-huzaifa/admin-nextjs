'use client';

import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';

// Dynamically import ServicesManagement with no SSR
const ServicesManagement = dynamic(
  () => import('@/components/ServicesManagement'),
  { ssr: false }
);

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Services Management</h1>
      <ServicesManagement />
    </DashboardLayout>
  );
}
