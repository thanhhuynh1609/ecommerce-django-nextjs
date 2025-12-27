"use client";

import { useEffect, useState    } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function ProductEdit({ params }: any) {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    api(`/products/${id}/`).then((data) => {
      setProduct(data);
      setForm(data);
    });

    api("/categories/").then(setCategories);
  }, []);

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const submitUpdate = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "thumbnail" && key !== "images" && typeof form[key] !== "object") {
      data.append(key, form[key]);}
    });

    if (thumbnail) data.append("thumbnail", thumbnail);

    if (images.length > 0) {
      images.forEach((img) => data.append("images", img));
    }

    await api(`/products/${id}/`, {
      method: "PUT",
      authenticated: true,
      credentials: "include",
      body: data,
    });

    router.push("/admin/products");
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Sửa sản phẩm #{id}</h1>

      <div className="space-y-3 mt-6">
        <input
          defaultValue={product.name}
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("name", e.target.value)}
        />

        <textarea
          defaultValue={product.description}
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("description", e.target.value)}
        />

        <input
          type="number"
          defaultValue={product.price}
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("price", e.target.value)}
        />
        <select
          className="border p-2 w-full rounded"
          onChange={(e) => updateForm("category", e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Thumbnail mới (nếu muốn thay):</label>
        <input
          type="file"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        />

        <label>Ảnh chi tiết mới:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />

        <button
          onClick={submitUpdate}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}
