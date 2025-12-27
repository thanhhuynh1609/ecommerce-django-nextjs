"use client";

import { useState } from "react";
import { api } from "@/src/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api("/users/register/", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });
      document.cookie = `access=${res.access}; path=/;`;
      document.cookie = `refresh=${res.refresh}; path=/;`;

      setMessage("Register successful!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          placeholder="Full name"
          value={fullName}
          className="border p-2"
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          className="border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white p-2 rounded">Register</button>
        <p className="text-sm text-red-500">{message}</p>
      </form>
      <Link href={"/login"}>Login</Link>
    </div>
  );
}
