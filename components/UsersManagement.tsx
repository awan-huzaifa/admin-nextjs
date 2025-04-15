'use client';

import React, { useState, useEffect } from 'react';
import { getUsers, updateUserStatus, updateUserDetails, User } from '@/services/users';
import Modal from './Modal';

interface State {
  users: User[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  selectedUser: User | null;
  formData: {
    name: string;
    phone: string;
  };
}

const UsersManagement: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>({
    users: [],
    loading: true,
    error: null,
    showModal: false,
    selectedUser: null,
    formData: {
      name: '',
      phone: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadUsers();
    }
  }, [mounted]);

  const loadUsers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const users = await getUsers();
      setState(prev => ({
        ...prev,
        users,
        loading: false
      }));
    } catch (err) {
      console.error('Error loading users:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load users. Please try again later.',
        loading: false
      }));
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateUserStatus(userId, { isActive: !currentStatus });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update user status. Please try again.',
        loading: false
      }));
    }
  };

  const handleEditClick = (user: User) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      formData: {
        name: user.name,
        phone: user.phone
      },
      showModal: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.selectedUser) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await updateUserDetails(state.selectedUser.id, state.formData);
      await loadUsers();
      setState(prev => ({
        ...prev,
        showModal: false,
        selectedUser: null,
        formData: { name: '', phone: '' },
        loading: false
      }));
    } catch (error) {
      console.error('Error updating user details:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update user details. Please try again.',
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

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto">
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Users Management
          </h2>
          <div className="text-sm text-gray-600">
            Total Users: {state.users.length}
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
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map(user => (
              <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  #{user.id}
                </td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleStatusToggle(user.id, user.isActive)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Blocked'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
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
            Edit User Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="user-name"
                type="text"
                value={state.formData.name}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, name: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                required
              />
            </div>

            <div>
              <label htmlFor="user-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="user-phone"
                type="tel"
                value={state.formData.phone}
                onChange={(e) => setState(prev => ({ ...prev, formData: { ...prev.formData, phone: e.target.value } }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                required
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UsersManagement; 