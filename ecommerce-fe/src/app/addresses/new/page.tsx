"use client";
import { useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import AddressSelector from "@/src/components/AddressSelector/AddressSelector";

export default function NewAddressPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");

  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddressChange = (data: any) => {
    setCity(data.province_name);
    setWard(data.ward_name);
    setStreet(data.street);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api("/users/addresses/", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          street: street,
          ward: ward,
          city: city,
          is_default: isDefault
        }),
      });

      setMessage("Thêm địa chỉ thành công!");
      setTimeout(() => router.push("/addresses"), 800);

    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Thêm địa chỉ mới</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input className="border p-2" placeholder="Họ và tên"
          value={fullName} onChange={e => setFullName(e.target.value)} />

        <input className="border p-2" placeholder="Số điện thoại"
          value={phone} onChange={e => setPhone(e.target.value)} />

        {/* Address Selector */}
        <AddressSelector onChange={handleAddressChange} />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          Đặt làm địa chỉ mặc định
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Lưu địa chỉ
        </button>

        <p className="text-green-600 text-sm">{message}</p>

      </form>

    </div>
  );
}
