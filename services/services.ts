import api from './api';

export interface VendorCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  vendorCategoryId: number;
  vendorCategory?: VendorCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  name: string;
  description: string;
  vendorCategoryId: number;
}

export const getVendorCategories = async () => {
  try {
    const response = await api.get('/admin/vendor-categories');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching vendor categories:', error);
    return [];
  }
};

export const getServices = async () => {
  try {
    const response = await api.get('/admin/services');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const addService = async (serviceData: ServiceInput) => {
  try {
    const response = await api.post('/admin/services', serviceData);
    console.log('Add Service Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Add Service Error:', error);
    throw error;
  }
};

export const updateService = async (id: number, serviceData: ServiceInput) => {
  try {
    const response = await api.put(`/admin/services/${id}`, serviceData);
    console.log('Update Service Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update Service Error:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: number) => {
  try {
    const response = await api.delete(`/admin/services/${serviceId}`);
    console.log('Delete Service Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete Service Error:', error);
    throw error;
  }
}; 