'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getServicesByCategory, Service, sendVerificationCode } from '@/services/vendorRegistration';
import { getVendorCategories } from '@/services/vendorCategories';

interface VendorCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface ServicePrice {
  serviceId: number;
  price: string;
}

interface Location {
  coords: {
    speed: number;
    heading: number;
    accuracy: number;
    altitude: number;
    latitude: number;
    longitude: number;
    altitudeAccuracy: number;
  };
  timestamp: number;
}

export default function VendorRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serviceArea, setServiceArea] = useState(5);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [vendorCategory, setVendorCategory] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [hasSmartphone, setHasSmartphone] = useState(true);
  const [phoneForCalls, setPhoneForCalls] = useState('');
  const [areaName, setAreaName] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (location) {
      console.log('Updated location:', location);
    }
  }, [location]);

  const loadCategories = async () => {
    try {
      const data = await getVendorCategories();
      setCategories(data);
    } catch (error) {
      setError('Failed to load categories. Please try again later.');
      console.error('Error loading categories:', error);
    }
  };

  const loadServicesForCategory = async (categoryId: string) => {
    try {
      // Fetch all services (with their category info)
      const response = await getServicesByCategory(''); // Pass empty to get all
      // Filter them on the frontend using the selected category id
      const filtered = response.services.filter(
        (service: Service & { vendorCategoryId?: number }) => String(service.vendorCategoryId) === String(categoryId)
      );
      setServices(filtered);
      setServicePrices(filtered.map((service: Service) => ({
        serviceId: service.id,
        price: ''
      })));
    } catch (error) {
      setError('Failed to load services for this category');
      console.error('Error loading services:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setVendorCategory(categoryId);
    loadServicesForCategory(categoryId);
  };

  const validatePrices = () => {
    const hasEmptyPrices = servicePrices.some(sp => !sp.price);
    const hasInvalidPrices = servicePrices.some(sp => isNaN(Number(sp.price)) || Number(sp.price) <= 0);
    return !hasEmptyPrices && !hasInvalidPrices;
  };

  const handleGeocode = async () => {
    if (!areaName) {
      setError('Please enter an area name');
      return;
    }

    setGeocodingLoading(true);
    setError(null);

    try {
        console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${areaName}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      console.log(data);

      if (data.status === 'OK' && data.results[0]) {
        const result = data.results[0];
        setLocation({
          coords: {
            speed: -1,
            heading: -1,
            accuracy: 10,
            altitude: 0,
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
            altitudeAccuracy: 30
          },
          timestamp: Date.now()
        });
        console.log(location);
      } else {
        setError('Could not find location. Please try a different area name.');
      }
    } catch (error) {
      setError('Error geocoding location. Please try again.');
      console.error('Geocoding error:', error);
    } finally {
      setGeocodingLoading(false);
    }
  };

  // Helper to build query string
  function buildQuery(params: Record<string, any>) {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !phoneNumber || !password || !confirmPassword || !vendorCategory || !areaName) {
      setError('Please fill all required fields');
      return;
    }

    if (!location) {
      setError('Please enter and verify the area name');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!validatePrices()) {
      setError('Please enter valid prices for all services');
      return;
    }

    if (!hasSmartphone && !phoneForCalls) {
      setError('Please provide a phone number for calls');
      return;
    }

    setLoading(true);
    try {
      await sendVerificationCode({ phone: phoneNumber });
      // Build query string for navigation
      const query = buildQuery({
        name,
        phoneNumber,
        password,
        serviceArea,
        vendorCategoryId: vendorCategory,
        servicePrices: JSON.stringify(servicePrices),
        hasSmartphone,
        phoneForCalls,
        areaName,
        location: JSON.stringify(location),
      });
      router.push(`/dashboard/vendors/register/verification?${query}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to send verification code');
      } else {
        setError('Failed to send verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 text-gray-800 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
                required
                title="Enter vendor's full name"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full text-gray-800 rounded-md p-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
                title="Enter vendor's phone number"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 text-gray-800 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
                title="Enter password"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full p-2 rounded-md text-gray-800 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
                title="Confirm password"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* Vendor Category and Services */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Vendor Category</label>
              <select
                value={vendorCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="mt-1 block w-full p-2 rounded-md text-gray-400 border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
                title="Select vendor category"
              >
                <option value="" className="text-gray-400">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-gray-400">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {services.length > 0 && (
              <div>
                
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <span className="flex-1">{service.name}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                    
                        value={servicePrices.find(sp => sp.serviceId === service.id)?.price || ''}
                        onChange={(e) => {
                          const newPrices = servicePrices.map(sp =>
                            sp.serviceId === service.id ? { ...sp, price: e.target.value } : sp
                          );
                          setServicePrices(newPrices);
                        }}
                        className="w-32 rounded-md border-gray-300 p-2 text-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                        title={`Enter price for ${service.name}`}
                        placeholder="Enter price"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Area Name and Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Area Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="mt-1 p-2 text-gray-800 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
                  required
                  title="Enter vendor's area name"
                  placeholder="Enter area name"
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={geocodingLoading || !areaName}
                  className="mt-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {geocodingLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {location && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Location Verified:</strong> {location.coords.latitude}, {location.coords.longitude}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">
            Service Area Radius: {serviceArea} km
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={serviceArea}
            onChange={(e) => setServiceArea(Number(e.target.value))}
            className="w-full accent-purple-600"
            title="Select service area radius"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Device Information</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="hasSmartphone"
                checked={hasSmartphone}
                onChange={() => setHasSmartphone(true)}
                className="mr-2 accent-purple-600"
              />
              <label htmlFor="hasSmartphone">Has Smartphone</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="noSmartphone"
                checked={!hasSmartphone}
                onChange={() => setHasSmartphone(false)}
                className="mr-2 accent-purple-600"
              />
              <label htmlFor="noSmartphone">No Smartphone</label>
            </div>
          </div>
        </div>

        {!hasSmartphone && (
          <div>
            <label className="block text-sm font-medium text-gray-400">Phone Number for Calls</label>
            <input
              type="tel"
              value={phoneForCalls}
              onChange={(e) => setPhoneForCalls(e.target.value)}
              className="mt-1 block w-full rounded-md text-gray-800 border-gray-300 p-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required={!hasSmartphone}
              title="Enter phone number for calls"
              placeholder="Enter phone number for calls"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Continue'}
          </button>
        </div>
      </form>
    </>
  );
} 