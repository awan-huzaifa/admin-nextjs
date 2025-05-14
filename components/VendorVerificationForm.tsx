"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCodeAndCreateUser } from '@/services/vendorRegistration';

interface VendorVerificationFormProps {
  phoneNumber: string;
  onSuccess?: () => void;
}

export default function VendorVerificationForm({ phoneNumber, onSuccess }: VendorVerificationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract registration data from query params
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phoneNumber') || '';
  const password = searchParams.get('password') || '';
  const serviceArea = Number(searchParams.get('serviceArea')) || 5;
  const vendorCategoryId = Number(searchParams.get('vendorCategoryId'));
  const servicePrices = searchParams.get('servicePrices') ? JSON.parse(searchParams.get('servicePrices')!) : [];
  const hasSmartphone = searchParams.get('hasSmartphone') === 'true';
  const phoneForCalls = searchParams.get('phoneForCalls') || '';
  const location = searchParams.get('location') ? JSON.parse(searchParams.get('location')!) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Call /users/verify-code-and-create-user with all registration data
      const response = await verifyCodeAndCreateUser({
        name,
        phone,
        password,
        location,
        role: 'vendor',
        code,
        serviceArea,
        vendorCategoryId,
        servicePrices,
        hasSmartphone,
        phoneForCalls,
      });
      if (response.success || response.message === "User verified and registered.") {
        // Success: go to next step
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard/vendors/register/cnic');
        }
      } else {
        setError(response.message || "Verification failed");
      }
    } catch (error) {
      setError("An error occurred during verification");
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded-md p-6 bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Verify Your Phone</h2>
      <p className="mb-4 text-gray-600">
        Please enter the verification code sent to {phoneNumber}
      </p>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    </div>
  );
} 