'use client';

import React, { useState, useEffect } from 'react';
import { getPendingVendors, approveVendor, rejectVendor } from '@/services/vendors';

interface Vendor {
  id: number;
  userId: number;
  cnicFrontImage: string;
  cnicBackImage: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  backgroundCheckStatus: 'pending' | 'passed' | 'failed';
  User: {
    name: string;
    phone: string;
  }
}

const PendingRequestsSection: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPendingVendors();
  }, []);

  const loadPendingVendors = async () => {
    try {
      setLoading(true);
      const data = await getPendingVendors();
      console.log('Fetched vendors:', data);
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
      setError('Failed to load pending vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: number) => {
    try {
      await approveVendor(vendorId);
      await loadPendingVendors(); // Refresh list
    } catch (error) {
      console.error('Error approving vendor:', error);
      setError('Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId: number) => {
    try {
      await rejectVendor(vendorId);
      await loadPendingVendors(); // Refresh list
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      setError('Failed to reject vendor');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-purple-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3">Vendor Name</th>
            <th scope="col" className="px-6 py-3">Phone</th>
            <th scope="col" className="px-6 py-3">CNIC Images</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                No pending requests found
              </td>
            </tr>
          ) : (
            vendors.map(vendor => (
              <tr key={vendor.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {vendor.User.name}
                </th>
                <td className="px-6 py-4">{vendor.User.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <a href={vendor.cnicFrontImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Front</a>
                    <a href={vendor.cnicBackImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Back</a>
                  </div>
                </td>
                <td className="px-6 py-4">{vendor.verificationStatus}</td>
                <td className="px-6 py-4">
                  {vendor.verificationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(vendor.id)}
                        className="mr-2 font-medium text-green-600 dark:text-green-500 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(vendor.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequestsSection;