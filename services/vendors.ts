import api from './api';

export const getPendingVendors = async () => {
  try {
    const response = await api.get('/admin/vendors/pending');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const approveVendor = async (vendorId: number) => {
  const response = await api.post(`/admin/vendors/${vendorId}/approve`);
  return response.data;
};

export const rejectVendor = async (vendorId: number) => {
  const response = await api.post(`/admin/vendors/${vendorId}/reject`);
  return response.data;
}; 