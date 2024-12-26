"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const AdminPage = () => {
  const [password, setPassword] = useState(""); // State to hold password input
  const [error, setError] = useState(""); // State for error message
  const router = useRouter(); // Initialize useRouter

  // Handle form submit for password check
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "123") {
      // Redirect to the admin dashboard if password is correct
      localStorage.setItem('ok', 'ok');
      document.cookie = "ok=ok; path=/; max-age=60*60*24; secure; samesite=strict";
      router.push("/admin");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>

        {/* Password input form */}
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full border rounded mb-4"
          />
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
