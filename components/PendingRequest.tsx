import React, { useState, useEffect } from 'react';

interface Request {
  id: number;
  vendorName: string;
  cnic: string;
  status: 'approved' | 'rejected' | 'pending';
}

const PendingRequestsSection: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    // Fetch pending requests from the backend
    fetch('/api/pending-requests')
      .then(response => response.json())
      .then(data => setRequests(data))
      .catch(error => console.error('Error fetching requests:', error));
  }, []);

  const handleApprove = (cnic: string) => {
    // Send approval to the backend
    fetch(`/api/approve-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnic }),
    })
      .then(response => response.json())
      .then(() => {
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.cnic === cnic ? { ...request, status: 'approved' } : request
          )
        );
      })
      .catch(error => console.error('Error approving request:', error));
  };

  const handleReject = (cnic: string) => {
    // Send rejection to the backend
    fetch(`/api/reject-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnic }),
    })
      .then(response => response.json())
      .then(() => {
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.cnic === cnic ? { ...request, status: 'rejected' } : request
          )
        );
      })
      .catch(error => console.error('Error rejecting request:', error));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-purple-600 text-white">
          <tr>
            <th scope="col" className="px-6 py-3">Vendor Name</th>
            <th scope="col" className="px-6 py-3">CNIC</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {request.vendorName}
              </th>
              <td className="px-6 py-4">{request.cnic}</td>
              <td className="px-6 py-4">{request.status}</td>
              <td className="px-6 py-4">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.cnic)}
                      className="mr-2 font-medium text-green-600 dark:text-green-500 hover:underline"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.cnic)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequestsSection;