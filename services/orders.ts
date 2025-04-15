import api from './api';

export interface Order {
  id: number;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  orderCustomer: {
    User: {
      name: string;
      phone: string;
    };
  };
  orderVendor: {
    User: {
      name: string;
      phone: string;
    };
  };
  orderService: {
    name: string;
  };
  orderPayment: {
    amount: number;
    status: string;
  };
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/admin/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<void> => {
  try {
    await api.put(`/admin/orders/${id}/status`, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 