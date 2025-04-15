'use client';

import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, Order } from '@/services/orders';
import Modal from './Modal';

interface State {
  orders: Order[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  selectedOrder: Order | null;
  status: string;
}

const OrdersManagement: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>({
    orders: [],
    loading: true,
    error: null,
    showModal: false,
    selectedOrder: null,
    status: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadOrders();
    }
  }, [mounted]);

  const loadOrders = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const orders = await getOrders();
      setState(prev => ({
        ...prev,
        orders,
        loading: false
      }));
    } catch (err) {
      console.error('Error loading orders:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load orders. Please try again later.',
        loading: false
      }));
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      setState(prev => ({
        ...prev,
        showModal: false,
        selectedOrder: null,
        status: '',
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to update order status';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  const handleStatusClick = (order: Order) => {
    setState(prev => ({
      ...prev,
      selectedOrder: order,
      status: order.status,
      showModal: true
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUserInfo = (user: { name: string; phone: string } | null) => {
    if (!user) return <div className="text-gray-400">Not available</div>;
    return (
      <>
        <div>{user.name}</div>
        <div className="text-sm text-gray-500">{user.phone}</div>
      </>
    );
  };

  if (!mounted) {
    return <div className="min-h-[200px]" />;
  }

  if (state.loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Orders Management
          </h2>
          <div className="text-sm text-gray-600">
            Total Orders: {state.orders.length}
          </div>
        </div>

        {state.error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {state.error}
          </div>
        )}

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-purple-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Vendor</th>
              <th scope="col" className="px-6 py-3">Service</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Payment Status</th>
              <th scope="col" className="px-6 py-3">Order Status</th>
              <th scope="col" className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {state.orders.map(order => (
              <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  #{order.id}
                </td>
                <td className="px-6 py-4">
                  {renderUserInfo(order.orderCustomer?.User)}
                </td>
                <td className="px-6 py-4">
                  {renderUserInfo(order.orderVendor?.User)}
                </td>
                <td className="px-6 py-4">
                  {order.orderService?.name || 'Not available'}
                </td>
                <td className="px-6 py-4">
                  Rs.{order.price || 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderPayment?.status || 'unknown')}`}>
                    {order.orderPayment?.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleStatusClick(order)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)} cursor-pointer`}
                  >
                    {order.status}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={state.showModal} onClose={() => setState(prev => ({ ...prev, showModal: false }))}>
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Update Order Status
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="order-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="order-status"
                value={state.status}
                onChange={(e) => setState(prev => ({ ...prev, status: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, showModal: false }))}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => state.selectedOrder && handleStatusUpdate(state.selectedOrder.id, state.status)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersManagement; 