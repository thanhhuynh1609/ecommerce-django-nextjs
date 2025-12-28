"use client";

import { useEffect, useState } from "react";
import { api, BACKEND_URL } from "@/src/lib/api";
import CartItem from "./CartItem";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/cart/", { authenticated: true })
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <div className="text-6xl mb-6">🛒</div>
      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Giỏ hàng của bạn đang trống</h2>
      <p className="text-gray-500 mt-2 mb-8 text-sm">Hãy quay lại cửa hàng để chọn cho mình những sản phẩm ưng ý nhất.</p>
      <Link href="/" className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 inline-block">
        Tiếp tục mua sắm
      </Link>
    </div>
  );

  const total = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-[2] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Giỏ hàng</h1>
            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">{cart.items.length} sản phẩm</span>
          </div>

          <div className="divide-y divide-gray-50">
            {cart.items.map((item: any) => (
              <CartItem
                key={item.id}
                item={item}
                reload={() => {
                  api("/cart/", { authenticated: true }).then(setCart);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-3xl p-8 sticky top-24 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight uppercase text-sm tracking-[0.2em]">Hóa đơn đơn hàng</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tạm tính</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                <span className="font-bold text-gray-900 text-lg">Tổng tiền</span>
                <span className="text-3xl font-black text-red-600 tracking-tighter">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-gray-900 hover:bg-black text-white text-center py-5 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
            >
              Tiến hành thanh toán
            </Link>

            <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Đổi trả trong vòng 7 ngày
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Bảo mật thanh toán 100%
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}