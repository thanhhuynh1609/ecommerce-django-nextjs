"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

export default function AddressSelector({ onChange }: any) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [provinceId, setProvinceId] = useState("");
  const [wardId, setWardId] = useState("");
  const [street, setStreet] = useState("");

  useEffect(() => {
    api("/address/provinces/").then(setProvinces);
  }, []);

  const loadWards = async (provId: string) => {
    setProvinceId(provId);
    setWardId("");
    setWards([]);

    if (provId) {
      const data = await api(`/address/provinces/${provId}/wards/`);
      setWards(data);
    }

    emitChange(provId, "", street);
  };

  const emitChange = (prov: any, ward: any, streetValue: string) => {
    const province_name = provinces.find((p) => p.code == prov)?.name || "";
    const ward_name = wards.find((w) => w.code == ward)?.name || "";

    onChange({
      province_id: prov,
      province_name,
      ward_id: ward,
      ward_name,
      street: streetValue,
    });
  };

  return (
    <div className="space-y-4">

      {/* Tỉnh */}
      <div>
        <label className="block font-medium mb-1">Tỉnh / Thành phố</label>
        <select
          value={provinceId}
          onChange={(e) => loadWards(e.target.value)}
          className="border p-3 rounded w-full"
        >
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Phường */}
      <div>
        <label className="block font-medium mb-1">Phường / Xã</label>
        <select
          value={wardId}
          disabled={!provinceId}
          onChange={(e) => {
            setWardId(e.target.value);
            emitChange(provinceId, e.target.value, street);
          }}
          className="border p-3 rounded w-full"
        >
          <option value="">-- Chọn phường/xã --</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>{w.name}</option>
          ))}
        </select>
      </div>

      {/* Street */}
      <div>
        <label className="block font-medium mb-1">Địa chỉ chi tiết</label>
        <input
          type="text"
          placeholder="Số nhà, tên đường..."
          className="border p-3 rounded w-full"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            emitChange(provinceId, wardId, e.target.value);
          }}
        />
      </div>

    </div>
  );
}
