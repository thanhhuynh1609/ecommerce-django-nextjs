"use client";
import Link from "next/link"; // Import Link để tối ưu chuyển trang
import Image from "next/image"; // (Tùy chọn) Dùng Image của Next.js sẽ tốt hơn
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  // Đóng menu khi user thay đổi (login/logout)
  useEffect(() => {
    setOpenMenu(false);
  }, [user]);
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 pb-0 lg:pb-0">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                className="w-auto h-8 lg:h-10"
                src="https://theme.hstatic.net/200000881795/1001243022/14/menu_icon_3.png?v=177"
                alt="Logo"
              />
              <span className="text-2xl font-bold tracking-tight text-blue-600">
                KING<span className="text-black">SHOP</span>
              </span>
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
          >
            {/* Menu open: "hidden", Menu closed: "block" */}
            <svg
              className="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            </svg>

            {/* Menu open: "block", Menu closed: "hidden" */}
            <svg
              className="hidden w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10"></div>
          {!loading && !user && (
            <Link
              href="/login"
              className="hidden lg:inline-flex px-4 py-3 ml-10 text-base font-semibold
                         text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Tham gia ngay
            </Link>
          )}
          {!loading && user && (
            <div className="relative ml-4">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span className="text-lg">👤</span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  {user.is_staff && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 hover:bg-gray-100"
                      onClick={() => setOpenMenu(false)}
                    >
                      Quản Lý
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-3 py-2 hover:bg-gray-100"
                    onClick={() => setOpenMenu(false)}
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 hover:bg-gray-100"
                    onClick={() => setOpenMenu(false)}
                  >
                    Đơn hàng
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Navigation (xs to lg) */}
        <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
          <div className="flow-root">
            <div className="flex flex-col px-6 -my-2 space-y-1">
              <Link
                href="/features"
                className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
              >
                {" "}
                Features{" "}
              </Link>
              <Link
                href="/solutions"
                className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
              >
                {" "}
                Solutions{" "}
              </Link>
              <Link
                href="/resources"
                className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
              >
                {" "}
                Resources{" "}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
              >
                {" "}
                Pricing{" "}
              </Link>
            </div>
          </div>

          <div className="px-6 mt-6">
            <Link
              href="/get-started"
              className="inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md items-center hover:bg-blue-700 focus:bg-blue-700"
              role="button"
            >
              Get started now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
