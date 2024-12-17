'use client';

import React, { useState } from 'react';
import HomePage from './homepage';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Check credentials
    if (username === '123' && password === '123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    // If authenticated, render the HomePage
    return <HomePage />;
  }

  // Login form for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
