"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/auth";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push("/login");
      return;
    }

    api("/users/me/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setUser(data))
      .catch(() => {
        router.push("/login");
      });
  }, []);

  if (!user) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl">My Profile</h1>
      <div className="border p-4 mt-4">
        <p>Email: {user.email}</p>
        <p>Full Name: {user.full_name}</p>
        <p>Phone: {user.phone}</p>
        <Link href="/addresses" className="bg-blue-600 text-white px-3 py-2 rounded inline-block mb-4">View address</Link>  
      </div>
      <Link href="/profile/edit" className="bg-blue-600 text-white px-3 py-2 rounded inline-block mb-4">
        Edit Profile
      </Link>

      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
