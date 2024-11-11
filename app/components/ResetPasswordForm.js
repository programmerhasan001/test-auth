"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("Password reset email sent. Please check your inbox.");
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage("Password has been reset successfully");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  if (!token) {
    return (
      <form onSubmit={handleRequestReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Request Password Reset
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div>
        <label htmlFor="password" className="block mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
