"use client";

import { useState } from "react";
import AddressSelector from "@/src/components/AddressSelector/AddressSelector";

export default function CheckoutPage() {
  const [address, setAddress] = useState<any>(null);

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

      <AddressSelector
        onChange={(data: any) => setAddress(data)}
      />

      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(address, null, 2)}
      </pre>
    </div>
  );
}
