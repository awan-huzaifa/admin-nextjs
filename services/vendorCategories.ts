import api from './api';
import { AxiosError } from 'axios';

export interface VendorCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface VendorCategoryInput {
  name: string;
  description: string;
  icon: string;
}

export const getVendorCategories = async (): Promise<VendorCategory[]> => {
  try {
    const response = await api.get('/admin/vendor-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor categories:', error);
    throw error;
  }
};

export const addVendorCategory = async (data: VendorCategoryInput): Promise<VendorCategory> => {
  try {
    const response = await api.post('/admin/vendor-categories', data);
    if (response.status === 201) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to add category');
  } catch (error) {
    console.error('Error adding vendor category:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to add category. Please try again.');
  }
};

export const updateVendorCategory = async (id: number, data: VendorCategoryInput): Promise<VendorCategory> => {
  try {
    const response = await api.put(`/admin/vendor-categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vendor category:', error);
    throw error;
  }
};

export const deleteVendorCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/admin/vendor-categories/${id}`);
  } catch (error) {
    console.error('Error deleting vendor category:', error);
    throw error;
  }
}; 