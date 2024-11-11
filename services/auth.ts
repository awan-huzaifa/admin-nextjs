import api from './api';

export const loginAdmin = async (credentials: { phone: string; password: string }) => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
}; 