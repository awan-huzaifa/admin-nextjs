'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PendingRequestsSection from '@/components/PendingRequest';

export default function PendingRequestsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Pending Verification Requests</h1>
      <PendingRequestsSection />
    </DashboardLayout>
  );
} 