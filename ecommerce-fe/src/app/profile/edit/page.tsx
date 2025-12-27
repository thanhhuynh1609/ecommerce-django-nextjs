"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getAccessToken();

    api("/users/me/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    }).then((data) => {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      if (data.avatar) setPreview('http://localhost:8000' +data.avatar);  // Đường dẫn ảnh từ BE
    });
  }, []);

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const token = getAccessToken();

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone", phone);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("http://localhost:8000/api/users/me/update/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    if (res.ok) {
      setMessage("Cập nhật thành công!");
      setTimeout(() => router.push("/profile"), 800);
    } else {
      setMessage("Lỗi cập nhật");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Cập nhật hồ sơ</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">

        <div className="relative w-24 h-24">
          {preview ? (
            <img
              src={preview}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300" />
          )}
        </div>

        <input type="file" accept="image/*" onChange={handleAvatarChange} />

        <input
          className="border p-2"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="bg-green-600 text-white p-2 rounded">
          Lưu thay đổi
        </button>

        <p className="text-green-600">{message}</p>
      </form>
    </div>
  );
}
