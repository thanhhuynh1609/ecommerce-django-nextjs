"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api("/orders/my-orders/", { authenticated: true })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.status === 401) router.push("/login");
      });
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "SHIPPING":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (orders.length === 0)
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-900">Chưa có đơn hàng nào</h2>
        <p className="text-gray-500 mt-2 mb-8">Có vẻ như bạn chưa đặt món đồ nào từ KingShop.</p>
        <Link href="/" className="px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 inline-block">
          Mua sắm ngay
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-500 text-sm">Theo dõi lộ trình và lịch sử đơn hàng</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="group block bg-white border border-gray-100 rounded-3xl p-5 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Cột trái: Thông tin chính */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Đơn hàng #{order.id}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {new Date(order.created_at).toLocaleDateString("vi-VN", { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Cột giữa: Trạng thái (Badge) */}
              <div className="flex items-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-tight border ${getStatusStyles(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Cột phải: Giá tiền & Mũi tên */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tổng thanh toán</p>
                  <p className="text-lg font-black text-red-600">
                    {(Number(order.total_price) + Number(order.shipping_fee)).toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <div className="hidden sm:block text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hiển thị nhanh ảnh các sản phẩm bên trong (nếu có dữ liệu) */}
            {order.items && order.items.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-hidden opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                {order.items.slice(0, 5).map((item: any, idx: number) => (
                   <img key={idx} src={`${BACKEND_URL}${item.product.thumbnail}`} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="product" />
                ))}
                {order.items.length > 5 && <span className="text-xs text-gray-400 flex items-center">+{order.items.length - 5}</span>}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => router.push("/profile")}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          ← Quay lại trang cá nhân
        </button>
      </div>
    </div>
  );
}