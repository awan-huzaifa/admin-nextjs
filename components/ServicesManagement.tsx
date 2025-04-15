'use client';

import React, { useState, useEffect } from 'react';
import { getServices, addService, updateService, deleteService, getVendorCategories } from '@/services/services';
import type { Service, VendorCategory, ServiceInput } from '@/services/services';
import Modal from './Modal';

interface State {
  services: Service[];
  categories: VendorCategory[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  editingService: Service | null;
  formData: {
    name: string;
    description: string;
    vendorCategoryId: string;
  };
}

interface FormData {
  name: string;
  description: string;
  vendorCategoryId: string;
}

const ServicesManagement: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>({
    services: [],
    categories: [],
    loading: true,
    error: null,
    showModal: false,
    editingService: null,
    formData: {
      name: '',
      description: '',
      vendorCategoryId: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadData();
    }
  }, [mounted]);

  const loadData = async () => {
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getServices(),
        getVendorCategories()
      ]);
      
      setState((prev: State) => ({
        ...prev,
        services: servicesData,
        categories: categoriesData,
        loading: false
      }));
    } catch (err) {
      console.error('Error initializing data:', err);
      setState((prev: State) => ({
        ...prev,
        error: 'Failed to load data',
        loading: false
      }));
    }
  };

  if (!mounted) {
    return <div className="min-h-[200px]" />;
  }

  if (state.loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!state.formData.name || !state.formData.vendorCategoryId) {
        setState((prev: State) => ({ ...prev, error: 'Name and Category are required' }));
        return;
      }

      const serviceData: ServiceInput = {
        name: state.formData.name,
        description: state.formData.description,
        vendorCategoryId: Number(state.formData.vendorCategoryId)
      };

      if (state.editingService) {
        await updateService(state.editingService.id, serviceData);
      } else {
        await addService(serviceData);
      }

      const servicesData = await getServices();
      setState((prev: State) => ({
        ...prev,
        showModal: false,
        services: servicesData,
        formData: { name: '', description: '', vendorCategoryId: '' },
        editingService: null,
        error: null
      }));
    } catch (err) {
      console.error('Error saving service:', err);
      setState((prev: State) => ({ ...prev, error: 'Failed to save service' }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await deleteService(id);
      const servicesData = await getServices();
      setState((prev: State) => ({ ...prev, services: servicesData }));
    } catch (err) {
      console.error('Error deleting service:', err);
      setState((prev: State) => ({ ...prev, error: 'Failed to delete service' }));
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Services Management
          </h2>
          <button
            onClick={() => {
              setState(prev => ({ ...prev, formData: { name: '', description: '', vendorCategoryId: '' }, editingService: null }));
              setState(prev => ({ ...prev, showModal: true }));
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add New Service
          </button>
        </div>

        {state.error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {state.error}
          </div>
        )}

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-purple-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Service Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.services.map(service => (
              <tr key={service.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {service.name}
                </td>
                <td className="px-6 py-4">
                  {service.vendorCategory?.name}
                </td>
                <td className="px-6 py-4">
                  {service.description}
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => {
                      setState(prev => ({
                        ...prev,
                        editingService: service,
                        formData: {
                          name: service.name,
                          description: service.description || '',
                          vendorCategoryId: service.vendorCategoryId.toString()
                        }
                      }));
                      setState(prev => ({ ...prev, showModal: true }));
                    }}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={state.showModal} onClose={() => setState(prev => ({ ...prev, showModal: false }))}>
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {state.editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="service-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="service-name"
                type="text"
                value={state.formData.name}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, name: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                required
                placeholder="Enter service name"
                aria-label="Service name"
              />
            </div>

            <div>
              <label htmlFor="service-category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="service-category"
                value={state.formData.vendorCategoryId}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, vendorCategoryId: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                required
                aria-label="Service category"
              >
                <option value="">Select a category</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="service-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="service-description"
                value={state.formData.description}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, description: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                rows={3}
                placeholder="Enter service description"
                aria-label="Service description"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setState(prev => ({ ...prev, showModal: false }));
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {state.editingService ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesManagement; 