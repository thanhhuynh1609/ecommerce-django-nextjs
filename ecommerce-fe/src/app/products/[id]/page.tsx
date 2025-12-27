"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { addToCart } from "@/src/lib/cart";
import ReviewForm from "./ReviewForm";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(() => {
    api(`/products/${id}/`)
      .then((data) => {
        setProduct(data);
        if (!mainImage) setMainImage(data.thumbnail); // Chỉ set lần đầu
        setLoading(false);

        // Lấy sản phẩm liên quan
        api(`/products/?category=${data.category}`).then((rel) =>
          setRelatedProducts(rel.filter((p: any) => p.id != data.id))
        );
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) return <p className="p-8">Đang tải sản phẩm...</p>;
  if (!product) return <p className="p-8">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Ảnh sản phẩm */}
      <div>
        <img
          src={
            "http://localhost:8000" + mainImage ||
            "http://localhost:8000" + product.thumbnail
          }
          className="w-full h-96 object-cover rounded-lg"
        />

        {/* Gallery ảnh phụ */}
        <div className="flex gap-2 mt-4">
          <img
            src={"http://localhost:8000" + product.thumbnail}
            className="w-20 h-20 object-cover border rounded cursor-pointer"
            onClick={() => setMainImage(product.thumbnail)}
          />

          {product.images.map((img: any) => (
            <img
              key={img.id}
              src={"http://localhost:8000" + img.image}
              onClick={() => setMainImage(img.image)}
              className="w-20 h-20 object-cover border rounded cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        <p className="text-red-600 text-3xl font-semibold mb-4">
          {Number(product.price).toLocaleString("vi-VN")} ₫
        </p>

        <p className="text-gray-700 mb-4">{product.description}</p>

        <p className="text-sm text-gray-500 mb-4">Tồn kho: {product.stock}</p>

        {/* Nút thêm vào giỏ hàng */}
        <button
          onClick={async () => {
            try {
              await addToCart(product.id, 1);
              alert("Đã thêm vào giỏ hàng!");
              window.location.href = "/cart";
            } catch {
              alert("Bạn cần đăng nhập trước!");
            }
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Đánh giá sản phẩm</h2>

        {/* Nếu user chưa review → hiển thị form */}
        <ReviewForm
          productId={id}
          reviews={product.reviews}
          reload={loadProduct}
        />

        {/* Danh sách review */}
        {product.reviews.length === 0 && (
          <p className="text-gray-500 mt-4">Chưa có đánh giá nào.</p>
        )}

        <div className="space-y-4 mt-4">
          {product.reviews.map((r: any) => (
            <div key={r.id} className="border p-4 rounded-lg">
              <p className="font-semibold">{r.user_name}</p>
              <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
              <p className="mt-2">{r.comment}</p>
              <span className="text-xs text-gray-500">
                {new Date(r.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="col-span-1 md:col-span-2 mt-10">
        <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>

        {relatedProducts.length === 0 && <p>Không có sản phẩm liên quan.</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedProducts.map((p) => (
            <Link
              href={`/products/${p.id}`}
              key={p.id}
              className="border rounded-lg p-2 hover:shadow"
            >
              <img
                src={"http://localhost:8000" + p.thumbnail}
                className="w-full h-32 object-cover rounded"
              />
              <p className="font-semibold line-clamp-1">{p.name}</p>
              <p className="text-red-600 font-bold">
                {Number(p.price).toLocaleString("vi-VN")} ₫
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
