'use client';

import DashboardLayout from '@/components/DashboardLayout';
import VendorRegisterForm from '@/components/VendorRegisterForm';

export default function VendorRegisterPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-black mb-8">Register New Vendor</h1>
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <VendorRegisterForm />
        </div>
      </div>
    </DashboardLayout>
  );
} 