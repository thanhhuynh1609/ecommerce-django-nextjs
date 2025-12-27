"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import CartItem from "./CartItem";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load cart từ backend
  useEffect(() => {
    api("/cart/", { authenticated: true })
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Đang tải giỏ hàng...</p>;
  if (!cart) return <p className="p-8">Không thể tải giỏ hàng</p>;

  // Tính tổng tiền
  const total = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {cart.items.length === 0 && (
        <p>Giỏ hàng đang trống.</p>
      )}

      <div className="space-y-4">

        {cart.items.map((item: any) => (
          <CartItem
            key={item.id}
            item={item}
            reload={() => {
              api("/cart/").then(setCart);
            }}
          />
        ))}

      </div>

      {/* Tổng tiền */}
      <div className="mt-8 border-t pt-4">
        <p className="text-xl font-semibold">
          Tổng cộng:{" "}
          <span className="text-red-600">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </p>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded mt-4 text-lg"
        >
          <a href="/checkout">Tiến hành thanh toán</a>
          
        </button>
      </div>
    </div>
  );
}
