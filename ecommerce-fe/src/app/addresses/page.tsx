"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddressListPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push("/login");
      return;
    }
    api("/users/addresses", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setAddresses(data);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, []);
  if (loading) return <p className="p-8">Loading address...</p>;
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sổ địa chỉ</h1>
      <Link
        href="/addresses/new"
        className="bg-blue-600 text-white px-3 py-2 rounded inline-block mb-4"
      >
        + Thêm địa chỉ mới
      </Link>
      <div className="flex flex-col gap-4">
        {addresses.map((addr: any) => (
            <div key={addr.id} className="border p-4 rounded shadow-sm">
            <p><strong>{addr.full_name}</strong> ({addr.phone})</p>
            <p>{addr.street}, {addr.district}, {addr.city}</p>

            {addr.is_default && (
              <span className="text-green-600 text-sm font-bold">Mặc định</span>
            )}

            <div className="flex gap-4 mt-2">
              <Link
                href={`/addresses/${addr.id}/edit`}
                className="text-blue-600 underline"
              >
                Sửa
              </Link>

              <button
                onClick={async () => {
                  if (confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) {
                    const token = getAccessToken();

                    await api(`/users/addresses/${addr.id}/`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` }
                    });

                    // cập nhật lại danh sách
                    setAddresses(addresses.filter(a => a.id !== addr.id));
                  }
                }}
                className="text-red-600 underline"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
