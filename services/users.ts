import api from './api';

export interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateUserStatus {
  isActive: boolean;
}

export interface UpdateUserDetails {
  name: string;
  phone: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (id: number, data: UpdateUserStatus): Promise<void> => {
  try {
    await api.put(`/admin/users/${id}/status`, data);
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const updateUserDetails = async (id: number, data: UpdateUserDetails): Promise<void> => {
  try {
    await api.put(`/admin/users/${id}/details`, data);
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
}; 