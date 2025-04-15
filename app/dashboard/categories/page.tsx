'use client';

import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';

// Dynamically import CategoriesManagement with no SSR
const CategoriesManagement = dynamic(
  () => import('@/components/CategoriesManagement'),
  { ssr: false }
);

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Categories Management</h1>
      <CategoriesManagement />
    </DashboardLayout>
  );
} 