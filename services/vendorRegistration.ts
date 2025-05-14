import api from './api';
import { AxiosError } from 'axios';

export interface VendorRegistrationInput {
  name: string;
  phoneNumber: string;
  password: string;
  serviceArea: number;
  vendorCategoryId: number;
  servicePrices: Array<{
    serviceId: number;
    price: number;
  }>;
  hasSmartphone: boolean;
  phoneForCalls?: string;
  areaName: string;
  location?: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    placeId: string;
  };
}

export interface VerificationInput {
  phone: string;
}

export interface VerifyCodeInput {
  name: string;
  phone: string;
  password: string;
  location: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    placeId: string;
  };
  role: string;
  code: string;
  serviceArea: number;
  vendorCategoryId: number;
  servicePrices: Array<{
    serviceId: number;
    price: number;
  }>;
  hasSmartphone: boolean;
  phoneForCalls: string;
}

export interface CNICInput {
  identityNumber: string;
  name: string;
  fatherName: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  gender: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  vendorCategoryId?: number;
}

export interface ServiceResponse {
  success: boolean;
  services: Service[];
}

// export const registerVendor = async (data: VendorRegistrationInput) => { ... }

export const sendVerificationCode = async (data: VerificationInput) => {
  try {
    const response = await api.post('/users/send-verification-code', data);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to send verification code');
  } catch (error) {
    console.error('Error sending verification code:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send verification code. Please try again.');
  }
};

export const verifyCodeAndCreateUser = async (data: VerifyCodeInput) => {
  try {
    const response = await api.post('/users/verify-code-and-create-user', data);
    if (response.status === 200 || response.status === 201) {
      if (!('success' in response.data) && response.data.message === "User verified and registered.") {
        response.data.success = true;
      }
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to verify code and create user');
  } catch (error) {
    console.error('Error verifying code:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to verify code. Please try again.');
  }
};

export const uploadCNIC = async (data: CNICInput) => {
  try {
    const response = await api.post('/users/upload-cnic', data);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to upload CNIC details');
  } catch (error) {
    console.error('Error uploading CNIC details:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload CNIC details. Please try again.');
  }
};

export const getServicesByCategory = async (categoryId?: string): Promise<ServiceResponse> => {
  try {
    // If categoryId is provided, use it; otherwise, fetch all
    const url = categoryId ? `/admin/services?categoryId=${categoryId}` : '/admin/services';
    const response = await api.get(url);
    return {
      success: true,
      services: response.data
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch services. Please try again.');
  }
}; 