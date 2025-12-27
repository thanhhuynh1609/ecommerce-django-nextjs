"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
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

        // Nếu backend trả 401 → redirect login
        if (err?.status === 401) {
          router.push("/login");
        }
      });
  }, []);

  if (loading) return <p className="p-8">Đang tải đơn hàng</p>;

  if (orders.length === 0)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Bạn chưa có đơn hàng nào</h2>
        <Link href="/" className="text-blue-600 mt-3 inline-block">
          Tiếp tục mua sắm →
        </Link>
      </div>
    );

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "CONFIRMED":
        return "text-blue-600";
      case "SHIPPING":
        return "text-purple-600";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block border rounded p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Mã đơn: #{order.id}</p>
            <p className={`font-bold ${statusColor(order.status)}`}>
              {order.status}
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
            <p>
              Tổng tiền:{" "}
              <span className="text-red-600 font-bold">
                {(Number(order.total_price) + Number(order.shipping_fee)).toLocaleString("vi-VN")}{" "}
                ₫
              </span>
            </p>
          </div>

          <div className="mt-2 text-blue-600 text-sm">Xem chi tiết →</div>
        </Link>
      ))}
    </div>
  );
}
