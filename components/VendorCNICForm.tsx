"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadCNIC } from '@/services/vendorRegistration';

interface VendorCNICFormProps {
  onSuccess?: () => void;
}

interface CNICFormData {
  identityNumber: string;
  name: string;
  fatherName: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  gender: string;
}

export default function VendorCNICForm({ onSuccess }: VendorCNICFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CNICFormData>({
    identityNumber: "",
    name: "",
    fatherName: "",
    dateOfBirth: "",
    dateOfExpiry: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await uploadCNIC(formData);
      if (response.success) {
        // Success: go to next step
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/vendors"); // Redirect to vendors list
        }
      } else {
        setError(response.message || "Failed to upload CNIC details");
      }
    } catch (error) {
      setError("An error occurred while uploading CNIC details");
      console.error("CNIC upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto border rounded-md p-6 bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Enter CNIC Details</h2>
      <p className="mb-4 text-gray-600">
        Please provide the vendor's CNIC information for verification
      </p>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">CNIC Number</label>
          <input
            type="text"
            name="identityNumber"
            placeholder="Enter CNIC number (e.g., 42201-1234567-1)"
            value={formData.identityNumber}
            onChange={handleChange}
            required
            pattern="\d{5}-\d{7}-\d{1}"
            title="CNIC number must be in format: 42201-1234567-1"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name as per CNIC"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Father's Name</label>
          <input
            type="text"
            name="fatherName"
            placeholder="Enter father's name as per CNIC"
            value={formData.fatherName}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            title="Date of Birth"
            placeholder="Select date of birth"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Date of Expiry</label>
          <input
            type="date"
            name="dateOfExpiry"
            value={formData.dateOfExpiry}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            title="Date of Expiry"
            placeholder="Select date of expiry"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
            title="Select gender"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit CNIC Details"}
        </button>
      </form>
    </div>
  );
} 