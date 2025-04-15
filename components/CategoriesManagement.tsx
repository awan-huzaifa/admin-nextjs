'use client';

import React, { useState, useEffect } from 'react';
import { getVendorCategories, addVendorCategory, updateVendorCategory, deleteVendorCategory } from '@/services/vendorCategories';
import Modal from './Modal';

interface VendorCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface State {
  categories: VendorCategory[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  editingCategory: VendorCategory | null;
  formData: {
    name: string;
    description: string;
    icon: string;
  };
}

const CategoriesManagement: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>({
    categories: [],
    loading: true,
    error: null,
    showModal: false,
    editingCategory: null,
    formData: {
      name: '',
      description: '',
      icon: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadCategories();
    }
  }, [mounted]);

  // Function to load categories
  const loadCategories = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const categoriesData = await getVendorCategories();
      setState(prev => ({
        ...prev,
        categories: categoriesData,
        loading: false
      }));
    } catch (err) {
      console.error('Error loading categories:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load categories',
        loading: false
      }));
    }
  };

  // Function to add a new category
  const handleAddCategory = async (categoryData: Omit<VendorCategory, 'id'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await addVendorCategory(categoryData);
      await loadCategories();
      setState(prev => ({
        ...prev,
        showModal: false,
        formData: { name: '', description: '', icon: '' },
        loading: false
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add category',
        loading: false
      }));
    }
  };

  // Function to update an existing category
  const handleUpdateCategory = async (id: number, categoryData: Omit<VendorCategory, 'id'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateVendorCategory(id, categoryData);
      await loadCategories();
      setState(prev => ({
        ...prev,
        showModal: false,
        editingCategory: null,
        formData: { name: '', description: '', icon: '' },
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to update category';
      
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

  // Function to delete a category
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deleteVendorCategory(id);
      await loadCategories();
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error deleting category:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete category',
        loading: false
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.formData.name) {
      setState(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }

    const categoryData = {
      name: state.formData.name,
      description: state.formData.description,
      icon: state.formData.icon
    };

    if (state.editingCategory) {
      await handleUpdateCategory(state.editingCategory.id, categoryData);
    } else {
      await handleAddCategory(categoryData);
    }
  };

  // Function to open edit modal
  const handleEditClick = (category: VendorCategory) => {
    setState(prev => ({
      ...prev,
      editingCategory: category,
      formData: {
        name: category.name,
        description: category.description || '',
        icon: category.icon || ''
      },
      showModal: true
    }));
  };

  // Function to open add modal
  const handleAddClick = () => {
    setState(prev => ({
      ...prev,
      editingCategory: null,
      formData: { name: '', description: '', icon: '' },
      showModal: true
    }));
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
            Categories Management
          </h2>
          <button
            onClick={handleAddClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add New Category
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
              <th scope="col" className="px-6 py-3">Category Name</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Icon</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.categories.map(category => (
              <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {category.name}
                </td>
                <td className="px-6 py-4">
                  {category.description}
                </td>
                <td className="px-6 py-4">
                  {category.icon}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
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
            {state.editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="category-name"
                type="text"
                value={state.formData.name}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, name: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                required
                placeholder="Enter category name"
                aria-label="Category name"
              />
            </div>

            <div>
              <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="category-description"
                value={state.formData.description}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, description: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                rows={3}
                placeholder="Enter category description"
                aria-label="Category description"
              />
            </div>

            <div>
              <label htmlFor="category-icon" className="block text-sm font-medium text-gray-700">
                Icon
              </label>
              <input
                id="category-icon"
                type="text"
                value={state.formData.icon}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, icon: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                placeholder="Enter icon name (e.g., wrench)"
                aria-label="Category icon"
              />
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
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {state.editingCategory ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesManagement; 