"use client";

import { useSearchParams } from "next/navigation";
import VendorVerificationForm from "@/components/VendorVerificationForm";

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "";

  return (
    <div className="container mx-auto py-8">
      <VendorVerificationForm phoneNumber={phoneNumber} />
    </div>
  );
} 