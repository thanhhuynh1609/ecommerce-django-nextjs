"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const [cart, setCart] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Load address + cart
  useEffect(() => {
    Promise.all([
      api("/users/addresses/", { authenticated: true }),
      api("/cart/", { authenticated: true }),
    ])
      .then(([addrData, cartData]) => {
        setAddresses(addrData);
        setCart(cartData);

        const defaultAddr = addrData.find((a: any) => a.is_default);
        setSelectedAddress(defaultAddr ? defaultAddr.id : null);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Đang tải...</p>;
  if (!cart || !addresses.length) return <p>Không thể tải dữ liệu</p>;

  // Tính subtotal
  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee = 25000;
  const total = subtotal + shippingFee;

  // Bấm nút đặt hàng
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setPlacingOrder(true);

    const res = await api("/orders/checkout/", {
      method: "POST",
      authenticated: true,
      body: JSON.stringify({
        address_id: selectedAddress,
        payment_method: paymentMethod,
        shipping_fee: shippingFee,
      }),
    });

    // Nếu COD → redirect FE
    if (paymentMethod === "COD") {
      window.location.href = `/order-success?order=${res.order_id}`;
      return;
    }

    // Nếu là VNPAY → backend trả payment_url
    if (paymentMethod === "VNPAY") {
      const payRes = await api("/payment/vnpay/", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({ order_id: res.order_id }),
      });

      window.location.href = payRes.payment_url;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

      {/* 1) Địa chỉ giao hàng */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>

        {addresses.map((addr) => (
          <label
            key={addr.id}
            className="flex items-center gap-2 border p-3 rounded mb-2 cursor-pointer"
          >
            <input
              type="radio"
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
            />
            <div>
              <p className="font-semibold">{addr.name} - {addr.phone}</p>
              <p className="text-sm">{addr.address}</p>
            </div>
          </label>
        ))}
      </div>

      {/* 2) Sản phẩm */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Sản phẩm</h2>

        {cart.items.map((item: any) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>{item.product.name} x {item.quantity}</span>
            <span>{(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫</span>
          </div>
        ))}
      </div>

      {/* 3) Phí ship + tổng */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Tổng tiền</h2>

        <div className="flex justify-between py-1">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="flex justify-between py-1">
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
        </div>

        <div className="flex justify-between py-2 text-lg font-bold border-t mt-2">
          <span>Tổng cộng</span>
          <span className="text-red-600">{total.toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>

      {/* 4) Phương thức thanh toán */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Phương thức thanh toán</h2>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Thanh toán khi nhận hàng (COD)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === "VNPAY"}
            onChange={() => setPaymentMethod("VNPAY")}
          />
          Thanh toán qua VNPAY
        </label>
      </div>

      {/* Button đặt hàng */}
      <button
        disabled={placingOrder}
        onClick={placeOrder}
        className="w-full bg-green-600 text-white p-4 rounded text-lg font-bold"
      >
        {placingOrder ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
}
